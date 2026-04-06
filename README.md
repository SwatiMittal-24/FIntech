# FinanceAI Dashboard

A clean, interactive finance dashboard interface built to help you track and understand your financial activity.

## Overview
This project is a React-based interactive web application developed as a finance dashboard. It demonstrates frontend proficiency through a clean UI, smooth data visualization, and effective state management.

## Features
- **Dashboard Summary**: Cleanly displays Net Worth, Bank Balance, Credit Outstanding, and quick insights.
- **Transactions & Budgets**: Add expenses that update in real-time, categorized tracking, and visual charts.
- **Roles & Permissions**: Switch between "Admin" (can add expenses/cards) and "Viewer" (read-only mode).
- **Custom Theming**: Seamless Dark and Light mode toggle.

---

## How to Run the Project

This project is built to accommodate two different types of presentations. You have two options for how to run it:

### Option 1: Run with Mock Data (Easiest — Recommended for Demos)
In this mode, you **do not** need to start the backend server or interact with an external database. The application has a defensive fallback system built-in. If the backend is off, it will instantly bypass the login screen and load the dashboard using safe, local mock data. Any new cards or expenses you add in this mode will be saved safely into your browser's local storage.

**Setup Instructions:**
1. Open your terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies (only needed the first time):
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser. You will instantly be logged in as a "Demo User" and directed to your fully-populated dashboard.

### Option 2: Run Full Stack (Backend + Frontend)
In this mode, you boot up both the frontend and your Express / MongoDB backend. The application will require you to register a fresh account or log in, as there will be no data loaded by default.

**Setup Instructions:**
1. **Start the Backend:**
   - Open a new terminal and navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Install dependencies if needed: `npm install`
   - Create your `.env` file and plug in your MongoDB credentials.
   - Run the API server:
     ```bash
     npm start
     ```
   *(Ensure it connects properly to your MongoDB cluster)*

2. **Start the Frontend:**
   - Leave the backend running, open a **second terminal**.
   - Navigate to the frontend folder:
     ```bash
     cd frontend
     ```
   - Install dependencies if needed: `npm install`
   - Run the web app:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:5173](http://localhost:5173).

**Important Note for Option 2:**
Because your database is fresh, your dashboard will be empty! You will need to **register a new account**, and then **manually insert data** (like adding credit cards and recording expenses) to populate your dashboard charts and tables.