import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Options = () => {
  const [maxDate, setMaxDate] = useState<string>()
  const [autoOpenTab, setAutoOpenTab] = useState<boolean>()
  const [pollingInterval, setPollingInverval] = useState<number>()

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        maxDate: '2021-12-31',
        autoOpenTab: true,
        pollingInterval: 5
      },
      (items) => {
        setMaxDate(items.maxDate)
        setAutoOpenTab(items.autoOpenTab)
        setPollingInverval(items.pollingInterval)
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        maxDate,
        autoOpenTab,
        pollingInterval
      }
    );
  };

  return (
    <>
      <div>
        Latest Date you want notifications on (yyyy-MM-dd)
        <input
          value={maxDate}
          onChange={(event) => setMaxDate(event.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={autoOpenTab}
            onChange={(event) => setAutoOpenTab(event.target.checked)}
          />
          Open tab automatically when an appointment is found
        </label>
      </div>
      <div>
        Polling interval (in seconds)
        <input
          value={pollingInterval}
          onChange={(event) => setPollingInverval(parseInt(event.target.value, 10))}
        />
      </div>
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
