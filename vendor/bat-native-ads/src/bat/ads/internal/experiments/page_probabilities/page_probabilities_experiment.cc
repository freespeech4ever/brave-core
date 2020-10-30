/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/experiments/page_probabilities/page_probabilities_experiment.h"

#include <string>

#include "base/metrics/field_trial.h"
#include "base/metrics/field_trial_params.h"
#include "base/strings/string_number_conversions.h"
#include "bat/ads/internal/ads_impl.h"
#include "bat/ads/internal/features.h"
#include "bat/ads/internal/logging.h"

namespace ads {
namespace experiments {

namespace {

const char kName[] = "PageProbabilitiesHistoryStudy";
const int kDefaultHistorySize = 5;

}  // namespace

PageProbabilities::PageProbabilities() = default;

PageProbabilities::~PageProbabilities() = default;

std::string PageProbabilities::get_name() const {
  return kName;
}

ExperimentInfo PageProbabilities::Get(
    const std::string& name) const {
  ExperimentInfo experiment;

  base::FieldTrial* field_trial = base::FieldTrialList::Find(name);
  if (!field_trial) {
    return experiment;
  }

  const int history_size = GetHistorySize();

  experiment = {
    field_trial->trial_name(),
    field_trial->group_name(),
    base::NumberToString(history_size)
  };

  return experiment;
}

int PageProbabilities::GetHistorySize() const {
  return GetFieldTrialParamByFeatureAsInt(
      features::kContextualAdsControl,
      "page_probabilities_history_entries",
      kDefaultHistorySize);
}

}  // namespace experiments
}  // namespace ads
