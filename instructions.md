# Running the application

## Prerequisites

* PostgreSQL installed and running locally.
* Node.js and npm/yarn installed.

## Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Create the database:**
   Make sure your local PostgreSQL service is running, then run:
   ```bash
   yarn db:create
   ```

4. **Run migrations and seed the database:**
   ```bash
   yarn db:migrate
   yarn db:seed
   ```

5. **Start the backend server:**
   ```bash
   yarn start
   ```

The backend server will be running at `http://localhost:4000`.

## Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start the React development server:**
   ```bash
   yarn start
   ```

The React app will be running at `http://localhost:3000`.