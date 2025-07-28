import React, { useEffect, useState } from "react";
import {
  refreshGroups,
  refreshMessages,
  refreshUserGroups,
} from "./utils/fetch";

import Dashboard from "./components/Dashboard";
import { hasPendingSyncItems } from "./db/db";
import { syncQueueItems } from "./utils/queue";

/*
  This app uses indexedDB (Dexie.js) to manage all interactions, 
  enabling offline-first functionality.

  All components are powered by `useLiveQuery` - https://dexie.org/docs/dexie-react-hooks/useLiveQuery()

  The live queries also allow components to remain in sync with local state, and can be 
  refreshed when it has sync with the api.
*/
function App() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const userId = 1;

  /*
  This function handles flushing the queue and re-syncing with the database.
  It only runs when the user is online and there are items in the queue.
  It prioritizes flushing the queue before syncing to ensure the correct data is persisted.
*/
  const flushQueueAndSync = async () => {
    if (!isOnline) {
      console.log("Offline, skipping sync");
      return;
    }

    setSyncing(true);

    try {
      const hasQueue = await hasPendingSyncItems();

      if (hasQueue) {
        console.log("Flushing queue...");
        await syncQueueItems();
      }

      await refreshGroups(userId);
      await refreshUserGroups(userId);
      await refreshMessages(userId);

      console.log("Sync complete");
    } catch (error) {
      console.error("Error syncing", error);
    } finally {
      setSyncing(false);
    }
  };

  /*
In a nutshell its queue based system

- Actions are processed into a indexDb store when the user is online and offline
- When the user is online it starts to poll every 5 seconds, it checks if there are items ready for processing
- If there are items to be processed it will perform the network requests and re sync to be update to date the DB.
- When the user is offline it stores the actions to be processed when the user comes back online.
*/

  useEffect(() => {
    if (!isOnline) return;

    const intervalId = setInterval(async () => {
      const hasQueue = await hasPendingSyncItems();
      if (hasQueue) {
        await flushQueueAndSync();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isOnline, userId]);

  return (
    <>
      {!isOnline && (
        <div className="bg-yellow-300 p-2 text-center mt-10">
          You are offline. Showing cached data.
        </div>
      )}

      <div className="fixed bottom-4 left-4 space-x-2">
        <button
          onClick={() => setIsOnline(true)}
          className="px-3 py-1 bg-green-500 text-white rounded"
          disabled={isOnline}
        >
          Go Online
        </button>
        <button
          onClick={() => setIsOnline(false)}
          className="px-3 py-1 bg-red-500 text-white rounded"
          disabled={!isOnline}
        >
          Go Offline
        </button>
      </div>

      {syncing && (
        <div className="fixed bottom-4 right-4 px-3 py-1 bg-blue-100 text-blue-800 rounded">
          Syncing…
        </div>
      )}

      <Dashboard userId={userId} />
    </>
  );
}

export default App;
