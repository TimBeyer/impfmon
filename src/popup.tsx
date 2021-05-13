import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames'
import './style.css';

const Options = () => {
  const [maxDate, setMaxDate] = useState<string>('')
  const [autoOpenTab, setAutoOpenTab] = useState<boolean>(true)
  const [pollingInterval, setPollingInverval] = useState<number>(5)
  const [changesSaved, setChangesSaved] = useState<boolean>(false)

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
      },
      () => {
        setChangesSaved(true)
      }
    );
  };

  return (
    <div className="p-6 mx-auto flex flex-col space-y-2 bg-white dark:bg-gray-800">
      <div className="flex flex-row content-center items-center">
        <img src="icon128.png" className="w-8"></img>
        <div className="text-2xl pl-2 font-medium text-black dark:text-gray-100">Impfmon</div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-500 dark:text-gray-200" htmlFor="date">
          Latest date you want notifications for
        </label>
        <input
          id="date"
          className="form-input rounded dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500"
          type="date"
          value={maxDate}
          onChange={(event) => {
            setMaxDate(event.target.value)
            setChangesSaved(false)
          }}
        ></input>
      </div>
      <div className="flex flex-col">
        <label htmlFor="pollingInterval" className="text-gray-500 dark:text-gray-200">How often to look for new appointments (seconds)</label>
        <input
        id="pollingInterval"
        className="form-input rounded dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500"
        type="text"
        value={pollingInterval}
        onChange={(event) => {
          setPollingInverval(parseInt(event.target.value, 10))
          setChangesSaved(false)
        }} 
        />
      </div>
      <div className="flex flex-row justify-between">
        <label htmlFor="openTab" className="text-gray-500 dark:text-gray-200">Open tab automatically when an appointment is found</label>
        <input
          id="openTab"
          className="rounded form-checkbox dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500"
          type="checkbox"
          checked={autoOpenTab}
          onChange={(event) => {
            setAutoOpenTab(event.target.checked)
            setChangesSaved(false)
          }}
        />
      </div>

      <button
        className={classNames([
          'h-9', 'rounded', 'border',
          'border-gray-300', 'dark:border-gray-500',
          'dark:bg-gray-600', 'dark:text-gray-300',
          'text-base'
        ], {
          'bg-lime-50': changesSaved,
          'dark:bg-lime-800': changesSaved,
        })}
        type="button"
        onClick={saveOptions}
      >{changesSaved ? 'Saved' : 'Save'}</button>
    </div>
    )

};

ReactDOM.render(
  <React.StrictMode>
    <Options />



  </React.StrictMode>,
  document.getElementById("root")
);
