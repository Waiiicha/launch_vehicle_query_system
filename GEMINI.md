# Launch Vehicle Query System

## Project Overview

This is a full-stack web application designed to query and display comprehensive information about global launch vehicles (rockets). It provides a modern, "Apple-style" user interface for browsing rocket specifications, propulsion details, and launch history.

### Tech Stack

*   **Frontend:** React (Vite), Material UI (MUI).
*   **Backend:** Node.js, Express.js.
*   **Database:** SQLite (managed via Prisma ORM).
*   **Data Source:** Markdown documentation and Excel sheets (processed into the database).

## Architecture

*   **`client/`**: The React frontend application.
    *   `src/App.jsx`: Main application logic, including the sidebar filter, rocket list, and detailed specifications modal.
    *   `src/theme.js`: Custom MUI theme configuration (Apple-style aesthetics).
*   **`server/`**: The Node.js backend API.
    *   `index.js`: Express server setup, API endpoints (`/api/rockets`), and static file serving for images.
    *   `prisma/schema.prisma`: Database schema definition for the `Rocket` model.
    *   `seed.js`: Database seeding script. It populates the database with hardcoded, high-quality data derived from project documentation.
    *   `link_images.js`: Utility script to scan the `pic/` directory and link images to rocket records in the database.
*   **`doc/`**: Project documentation and data sources (Markdown, Excel).
*   **`pic/`**: Image repository for rocket photos.

## Setup and Running

### Prerequisites

*   Node.js (v18+ recommended)
*   npm

### Installation

1.  **Backend Setup:**
    ```bash
    cd server
    npm install
    npx prisma db push  # Initialize SQLite database
    npm run seed        # Populate database with rocket data
    node link_images.js # Link images from ../pic to database records
    ```

2.  **Frontend Setup:**
    ```bash
    cd client
    npm install
    ```

### Running the Application

**Option 1: Windows Batch Script**
Double-click the `start.bat` file in the root directory. This will open two terminal windows (one for server, one for client) and launch the application.

**Option 2: Manual Start**
1.  Start Backend:
    ```bash
    cd server
    npm run dev
    ```
2.  Start Frontend:
    ```bash
    cd client
    npm run dev
    ```
3.  Access the application at `http://localhost:5173`.

## Key Features

*   **Advanced Filtering:** Filter rockets by Country, Manufacturer, Status (Active/Dev/Retired), Fuel Type, LEO Capacity (slider), and Reusability.
*   **Cascading Filters:** Selecting a country automatically filters the available manufacturers.
*   **Holographic Details:** Detailed modal view displaying physical specs, multi-stage propulsion data, and recovery methods.
*   **Image Gallery:** Support for multiple images per rocket with a scrolling gallery in the details view.
*   **Result Directory:** A quick-access list of filtered results in the sidebar.

## Development Notes

*   **Data Updates:** To update rocket data, modify the hardcoded `rocketsData` array in `server/seed.js` and re-run `npm run seed`.
*   **Image Updates:** Add new images to `pic/` with filenames matching the rocket name (e.g., `CZ-5.jpg`). Re-run `node server/link_images.js` to update the database links.
*   **API:** The backend runs on port `3001` by default. The frontend proxies API requests to this port.
