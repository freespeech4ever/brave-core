/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BAT_ADS_INTERNAL_EXPERIMENTS_PAGE_PROBABILITIES_PAGE_PROBABILITIES_EXPERIMENT_H_  // NOLINT
#define BAT_ADS_INTERNAL_EXPERIMENTS_PAGE_PROBABILITIES_PAGE_PROBABILITIES_EXPERIMENT_H_  // NOLINT

#include <string>

#include "bat/ads/internal/experiments/experiment.h"

namespace ads {
namespace experiments {

class PageProbabilities : public Experiment {
 public:
  PageProbabilities();

  ~PageProbabilities() override;

  std::string get_name() const override;

  ExperimentInfo Get(
      const std::string& name) const override;

  int GetHistorySize() const;
};

}  // namespace experiments
}  // namespace ads

#endif  // BAT_ADS_INTERNAL_EXPERIMENTS_PAGE_PROBABILITIES_PAGE_PROBABILITIES_EXPERIMENT_H_  // NOLINT
