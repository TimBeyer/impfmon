import { fetchImpfstoffLink, urls } from "./lib/impfstoff-link"
import { DateTime } from 'luxon'
import { ExpiringSeenList } from "./lib/expiring-seen-list"
import { defaults } from './lib/defaults'

const ERROR_PAUSE_TIME = 10000

async function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

// Expire after five minutes
const EXPIRY = 1000 * 60 * 5;
const seenList = new ExpiringSeenList(EXPIRY);

function run (): () => void {
  let running = true

  chrome.storage.sync.get(
    ['maxDate', 'autoOpenTab', 'pollingInterval', 'isPaused'],
    ({ maxDate = defaults.maxDate, autoOpenTab = defaults.autoOpenTab, pollingInterval = defaults.pollingInterval, isPaused = defaults.isPaused }) => {

      const MAX_DATE = DateTime.fromFormat(maxDate, 'yyyy-MM-dd');
      const MAX_AGE = 5;

      const POLL_INTERVAL = pollingInterval * 1000

      console.log(
        `Starting up with max date: ${maxDate}, auto open: ${autoOpenTab}, pollingInterval: ${POLL_INTERVAL}, isPaused: ${isPaused}`
      );

      // If we are paused we just return as every config change
      // and thus also the pausing behavior actually creates a new instance of the polling
      if (isPaused) {
        return
      }

      async function polling() {
        console.log("Fetching data");
        let data
        try {
          data = await fetchImpfstoffLink();
          chrome.runtime.sendMessage({
            lastUpdate: Date.now()
          });
        } catch (err) {
          console.log(`Error fetching data`)
          console.log(err)
          await sleep(ERROR_PAUSE_TIME)
          polling()
          return
        }
        for (const venue of data.stats) {
          if (!venue.open) {
            continue;
          }

          for (const [dateKey, stats] of Object.entries(venue.stats)) {
            const date = DateTime.fromFormat(dateKey, "yyyy-MM-dd");
            if (date >= MAX_DATE) {
              // This date is too late already, ignore
              continue;
            }

            const lastSeenDate = DateTime.fromMillis(stats.last);
            const now = DateTime.now();

            const diff = now.diff(lastSeenDate, ["minutes"]);

            if (diff.minutes > MAX_AGE) {
              // Only alert for 5 minutes
              continue;
            }

            const seenKey = `${venue.id}:${dateKey}`;
            if (seenList.has(seenKey)) {
              console.log(`Already seen ${seenKey}`)
              continue;
            }
            console.log("Found date", seenKey);
            console.log(`Go to ${urls[venue.id]}`);
            seenList.add(seenKey);
            chrome.notifications.create(`vaccination-appointment-${venue.id}`, {
              type: "basic",
              title: `Vaccination appointment found for ${dateKey}`,
              message: `Go to ${urls[venue.id]}`,
              iconUrl: "icon128.png",
              isClickable: true,
            });

            if (autoOpenTab) {
              chrome.tabs.create({
                url: urls[venue.id],
              });
            }
          }
        }
        if (running) {
          setTimeout(polling, POLL_INTERVAL);
        }
      }
      polling();
    }
  );
  
  return () => {
    running = false
  }
}

let stop = run()

chrome.notifications.onClicked.addListener((id) => {
  for (const [venueId, url] of Object.entries(urls)) {
    if (id === `vaccination-appointment-${venueId}`) {
      chrome.tabs.create({
        url,
      });
    }
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    console.log('Settings changed, restarting')
    stop()
    stop = run()
  }
});
