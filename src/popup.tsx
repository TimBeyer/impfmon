import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames'
import './style.css';

const Options = () => {
  const [maxDate, setMaxDate] = useState<string>('')
  const [autoOpenTab, setAutoOpenTab] = useState<boolean>(true)
  const [pollingInterval, setPollingInverval] = useState<number>(5)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        maxDate: '2021-12-31',
        autoOpenTab: true,
        pollingInterval: 5,
        isPaused: false
      },
      (items) => {
        setMaxDate(items.maxDate)
        setAutoOpenTab(items.autoOpenTab)
        setPollingInverval(items.pollingInterval)
        setIsPaused(items.isPaused)
      }
    );
  }, []);

  useEffect(() => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        maxDate,
        autoOpenTab,
        pollingInterval,
        isPaused
      }
    );
  }, [maxDate, autoOpenTab, pollingInterval, isPaused])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.lastUpdate) {
        setLastUpdate(request.lastUpdate)
      }
    })
  }, [])

  return (<div className="bg-white dark:bg-gray-800 pl-6 pt-3 pb-3 pr-6">
    <div className=" mx-auto flex flex-col space-y-2 pb-3">
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
          }}
        />
      </div>

    </div>

    <div className="flex flex-row content-center items-center justify-between text-gray-500 dark:text-gray-200">
      <button
        type="button"
        onClick={(event) => {
          setIsPaused(!isPaused)
        }}>{isPaused ? 'Resume' : 'Pause'}</button>
      <div className="flex flex-row content-center items-center">
        <div className={classNames('rounded-full','w-2','h-2','mr-1', {
          'bg-green-500': !isPaused,
          'bg-red-500': isPaused
        })}></div>
        <p>{isPaused ? 'Paused' : `Last update ${(new Date(lastUpdate)).toLocaleString()}`}</p>
      </div>
    </div>
  </div>)
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
