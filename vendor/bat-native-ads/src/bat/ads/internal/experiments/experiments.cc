/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/experiments/experiments.h"

#include <string>

#include "bat/ads/internal/ads_impl.h"
#include "bat/ads/internal/experiments/experiments_util.h"
#include "bat/ads/internal/experiments/page_probabilities/page_probabilities_experiment.h"
#include "bat/ads/internal/logging.h"

namespace ads {

Experiments::Experiments(
    AdsImpl* ads)
    : ads_(ads) {
  DCHECK(ads_);
}

Experiments::~Experiments() = default;

void Experiments::Log() {
  experiments::PageProbabilities page_probabilities_experiment;
  const std::string experiment_name = page_probabilities_experiment.get_name();
  if (!experiments::IsActive(experiment_name)) {
    BLOG(1, "No active experiment");
  } else {
    const experiments::ExperimentInfo experiment =
        page_probabilities_experiment.Get(experiment_name);
    BLOG(1, "Running active experiment: \n"
        << "  name: " << experiment.name << "\n"
        << "  group: " << experiment.group << "\n"
        << "  value: " << experiment.value);
  }
}

}  // namespace ads
