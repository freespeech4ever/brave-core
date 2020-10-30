/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BAT_ADS_INTERNAL_EXPERIMENTS_EXPERIMENT_INFO_H_
#define BAT_ADS_INTERNAL_EXPERIMENTS_EXPERIMENT_INFO_H_

#include <string>

namespace ads {
namespace experiments {

struct ExperimentInfo {
  std::string name;
  std::string group;
  std::string value;
};

}  // namespace experiments
}  // namespace ads

#endif  // BAT_ADS_INTERNAL_EXPERIMENTS_EXPERIMENT_INFO_H_
