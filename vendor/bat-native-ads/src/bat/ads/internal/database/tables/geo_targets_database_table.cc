/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/database/tables/geo_targets_database_table.h"

#include <utility>

#include "base/strings/stringprintf.h"
#include "bat/ads/internal/ads_impl.h"
#include "bat/ads/internal/database/database_statement_util.h"
#include "bat/ads/internal/database/database_table_util.h"
#include "bat/ads/internal/database/database_util.h"
#include "bat/ads/internal/logging.h"

namespace ads {
namespace database {
namespace table {

using std::placeholders::_1;

namespace {
const char kTableName[] = "geo_targets";
}  // namespace

GeoTargets::GeoTargets(
    AdsImpl* ads)
    : ads_(ads) {
  DCHECK(ads_);
}

GeoTargets::~GeoTargets() = default;

void GeoTargets::InsertOrUpdate(
    DBTransaction* transaction,
    const CreativeAdList& creative_ads) {
  DCHECK(transaction);

  if (creative_ads.empty()) {
    return;
  }

  DBCommandPtr command = DBCommand::New();
  command->type = DBCommand::Type::RUN;
  command->command = BuildInsertOrUpdateQuery(command.get(), creative_ads);

  transaction->commands.push_back(std::move(command));
}

void GeoTargets::Delete(
    ResultCallback callback) {
  DBTransactionPtr transaction = DBTransaction::New();

  util::Delete(transaction.get(), get_table_name());

  ads_->get_ads_client()->RunDBTransaction(std::move(transaction),
      std::bind(&OnResultCallback, _1, callback));
}

std::string GeoTargets::get_table_name() const {
  return kTableName;
}

void GeoTargets::Migrate(
    DBTransaction* transaction,
    const int to_version) {
  DCHECK(transaction);

  switch (to_version) {
    case 1: {
      MigrateToV1(transaction);
      break;
    }

    case 3: {
      MigrateToV3(transaction);
      break;
    }

    default: {
      break;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////

int GeoTargets::BindParameters(
    DBCommand* command,
    const CreativeAdList& creative_ads) {
  DCHECK(command);

  int count = 0;

  int index = 0;
  for (const auto& creative_ad : creative_ads) {
    for (const auto& geo_target : creative_ad.geo_targets) {
      BindString(command, index++, creative_ad.campaign_id);
      BindString(command, index++, geo_target);

      count++;
    }
  }

  return count;
}

std::string GeoTargets::BuildInsertOrUpdateQuery(
    DBCommand* command,
    const CreativeAdList& creative_ads) {
  const int count = BindParameters(command, creative_ads);

  return base::StringPrintf(
      "INSERT OR REPLACE INTO %s "
          "(campaign_id, "
          "geo_target) VALUES %s",
      get_table_name().c_str(),
      BuildBindingParameterPlaceholders(2, count).c_str());
}

void GeoTargets::CreateTableV1(
    DBTransaction* transaction) {
  DCHECK(transaction);

  const std::string query = base::StringPrintf(
      "CREATE TABLE %s "
          "(creative_instance_id TEXT NOT NULL, "
          "geo_target TEXT NOT NULL, "
          "UNIQUE(creative_instance_id, geo_target) ON CONFLICT REPLACE, "
          "CONSTRAINT fk_creative_instance_id "
              "FOREIGN KEY (creative_instance_id) "
              "REFERENCES creative_ad_notifications (creative_instance_id) "
              "ON DELETE CASCADE)",
      get_table_name().c_str());

  DBCommandPtr command = DBCommand::New();
  command->type = DBCommand::Type::EXECUTE;
  command->command = query;

  transaction->commands.push_back(std::move(command));
}

void GeoTargets::CreateIndexV1(
    DBTransaction* transaction) {
  DCHECK(transaction);

  util::CreateIndex(transaction, get_table_name(), "geo_target");
}

void GeoTargets::MigrateToV1(
    DBTransaction* transaction) {
  DCHECK(transaction);

  util::Drop(transaction, get_table_name());

  CreateTableV1(transaction);
  CreateIndexV1(transaction);
}

void GeoTargets::CreateTableV3(
    DBTransaction* transaction) {
  DCHECK(transaction);

  const std::string query = base::StringPrintf(
      "CREATE TABLE %s "
          "(campaign_id TEXT NOT NULL, "
          "geo_target TEXT NOT NULL, "
          "PRIMARY KEY (campaign_id, geo_target), "
          "UNIQUE(campaign_id, geo_target) ON CONFLICT REPLACE)",
      get_table_name().c_str());

  DBCommandPtr command = DBCommand::New();
  command->type = DBCommand::Type::EXECUTE;
  command->command = query;

  transaction->commands.push_back(std::move(command));
}

void GeoTargets::CreateIndexV3(
    DBTransaction* transaction) {
  DCHECK(transaction);

  util::CreateIndex(transaction, get_table_name(), "campaign_id");
}

void GeoTargets::MigrateToV3(
    DBTransaction* transaction) {
  DCHECK(transaction);

  util::Drop(transaction, get_table_name());

  CreateTableV3(transaction);
}

}  // namespace table
}  // namespace database
}  // namespace ads
