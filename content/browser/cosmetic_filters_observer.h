/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 3.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_CONTENT_BROWSER_COSMETIC_FILTERS_OBSERVER_H_
#define BRAVE_CONTENT_BROWSER_COSMETIC_FILTERS_OBSERVER_H_

namespace content {
class CosmeticFiltersObserver {
 public:
   CosmeticFiltersObserver() {}
   ~CosmeticFiltersObserver() {}

   virtual void HiddenClassIdSelectors() {}
};

}  // namespace content

#endif  // BRAVE_CONTENT_BROWSER_COSMETIC_FILTERS_OBSERVER_H_
