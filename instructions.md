# Running the application

## Prerequisites

- PostgreSQL installed and running locally
- Node.js and npm/yarn installed
- Git (for cloning the repository)

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joshuanewman1993/spruce-chat
   ```

## Backend Setup

1.  **Navigate to the backend folder:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

3.  **Create and setup the database:**
    Make sure your local PostgreSQL service is running, then:

    ```bash
    # Create the database
    yarn db:create

    # Run migrations to create tables
    yarn db:migrate

    # Seed the database with initial data
    yarn db:seed
    ```


4. **Set up the database connection:**
   Update the `.env` file in the backend directory with the database connection string:

   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/chat_app
   ```


5.  **Start the backend server:**

    ```bash
    yarn start
    ```

    ✅ The backend server will be running at `http://localhost:4000`

## Frontend Setup

1. **Open a new terminal and navigate to the frontend folder:**

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

   ✅ The React app will be running at `http://localhost:3000`
