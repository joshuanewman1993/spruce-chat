# Spruce chat app
Please see [this document](./instructions.md) for getting the application running.

I've included an image of my initial brainstorming for the app [here](./excaild.md).

## 🚀 Overall approach

All user interactions are stored locally in IndexedDB first, allowing the app to work offline. Users can send messages, join and leave groups without an internet connection. When users perform actions (online or offline), they're queued locally and processed asynchronously. A background sync process runs every 5 seconds when online, flushing the queue and syncing with the backend. The UI updates based on local IndexDB data.

## 🚀 Frontend Stack

The frontend is built with React and I have used Tailwind CSS for styling.

Axios has been added to handles HTTP requests for backend API.

IndexedDB is used via Dexie.js to store and manage local data. This allows for offline support, with local writes being queued and synced to the server once back online.

Frontend components are powered by useLiveQuery, which allows real-time updates with IndexedDB, so views automatically update when the database changes.


## 🚀 Backend Stack

The API is built with Fastify.

Knex.js is used as the database layer, managing migrations and schema changes.

The schema is defined in migrations/schema.js and models a relational structure for users, groups, user_groups, and messages.

## 🌐 Offline Support

The app supports offline mode by persisting user actions (e.g. sending messages) in a local queue.

An "Online/Offline" toggle is provided to simulate connectivity changes during development.

Once reconnected, the queue is flushed and the app re-syncs with the server.

**Messages only show as delivered when it has been stored in the postgres DB**

## 👤 Users

Although the API supports users, for now the app uses a hardcoded userId for local persistence and testing.

Multi-user support can easily be added by enhancing login flows and indexing local data per user.


## Future considerations

The Messages component currently has some minor issues. Because it relies on useLiveQuery, each time the online sync finishes and the IndexedDB messages update, the component re-renders causing not great UI experience. Potentially maintaining a local copy of the messages in state and update it intelligently would sovle this.

Currently the user is hardcoded but the API and DB can support multi users which having more time would allow.

I was having issues sorting the IndexDB by message date, given more time I would move away from the local sort and push the API/IndexDB layer.

**Testing**- With additional time, I would add comprehensive tests for both the functions and components. There is some 

