/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BAT_ADS_INTERNAL_EXPERIMENTS_EXPERIMENT_H_
#define BAT_ADS_INTERNAL_EXPERIMENTS_EXPERIMENT_H_

#include <string>

#include "bat/ads/internal/experiments/experiment_info.h"

namespace ads {
namespace experiments {

class Experiment {
 public:
  virtual ~Experiment() = default;

  virtual std::string get_name() const = 0;

  virtual ExperimentInfo Get(
      const std::string& name) const = 0;
};

}  // namespace experiments
}  // namespace ads

#endif  // BAT_ADS_INTERNAL_EXPERIMENTS_EXPERIMENT_H_
