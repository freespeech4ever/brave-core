/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/experiments/experiments_util.h"

#include "base/metrics/field_trial.h"

namespace ads {
namespace experiments {

bool IsActive(
    const std::string& name) {
  if (!base::FieldTrialList::Find(name)) {
    return false;
  }

  return true;
}

}  // namespace experiments
}  // namespace ads
