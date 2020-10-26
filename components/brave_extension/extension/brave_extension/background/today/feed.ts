import { isPublisherContentAllowed } from '../../../../../common/braveToday'
import { getOrFetchData as getOrFetchPublishers, addPublishersChangedListener } from './publishers'
import feedToData from './feedToData'
import { URLS } from './privateCDN'

type RemoteData = BraveToday.FeedItem[]

const feedUrl = URLS.braveTodayFeed

let memoryTodayData: BraveToday.Feed | undefined

let readLock: Promise<void> | null

const STORAGE_SCHEMA_VERSION = 1

function isValidStorageData (data: {[key: string]: any}) {
  return (
    data && data.today &&
    data.today.storageSchemaVersion === STORAGE_SCHEMA_VERSION &&
    data.today.feed
  )
}

function setStorageData (feed: BraveToday.Feed) {
  chrome.storage.local.set({
    storageSchemaVersion: STORAGE_SCHEMA_VERSION,
    feed
  })
}

function getStorageData () {
  return new Promise<void>(resolve => {
    // Load any data from memory, as long as it is the expected format.
    chrome.storage.local.get('today', (data) => {
      if (isValidStorageData(data)) {
        memoryTodayData = data.today.feed
      }
      resolve()
    })
  })
}

// Immediately read from local storage and ensure we don't try
// to fetch whilst we're waiting.
const getLocalDataLock = getStorageData()

function performUpdateFeed() {
  // Sanity check
  if (readLock) {
    console.error('Asked to update feed but already waiting for another update!')
    return
  }
  // Only run this once at a time, otherwise wait for the update
  readLock = new Promise(async function (resolve, reject) {
    try {
      const [feedResponse, publishers] = await Promise.all([
        fetch(feedUrl),
        getOrFetchPublishers()
      ])
      if (feedResponse.ok) {
        const feedContents: RemoteData = await feedResponse.json()
        console.debug('fetched feed', feedContents)
        if (!publishers) {
          throw new Error('no publishers to filter feed')
        }
        const enabledPublishers = {}
        for (const publisher of Object.values(publishers)) {
          if (isPublisherContentAllowed(publisher)){
            enabledPublishers[publisher.publisher_id] = publisher
          }
        }
        memoryTodayData = await feedToData(feedContents, enabledPublishers)
        resolve()
        if (memoryTodayData) {
          setStorageData(memoryTodayData)
        }
      } else {
        throw new Error(`Not ok when fetching feed. Status ${feedResponse.status} (${feedResponse.statusText})`)
      }
    } catch (e) {
      console.error('Could not process feed contents from ', feedUrl)
      reject(e)
    } finally {
      readLock = null
    }
  })
}

export async function getOrFetchData() {
  await getLocalDataLock
  if (memoryTodayData) {
    return memoryTodayData
  }
  return await update()
}

export async function update(force: boolean = false) {
  // Fetch but only once at a time, and wait.
  if (!readLock) {
    performUpdateFeed()
  } else if (force) {
    // If there was already an update in-progress, and we want
    // to make sure we use the latest data, we'll have to perform
    // another update to be sure.
    await readLock
    performUpdateFeed()
  }
  await readLock
  return memoryTodayData
}

// When publishers (or publishers prefs) changes, update articles
addPublishersChangedListener(function (publishers) {
  update(true)
})