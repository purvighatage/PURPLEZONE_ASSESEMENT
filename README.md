# PurpleZone Grammar Checker & MCQ Flashcards App

PurpleZone is a premium, interactive MERN (MongoDB, Express, React, Node.js) web application designed for grammar assessment. It features a polished Obsidian Twilight aesthetic with a responsive user interface, split-screen login, interactive multiple-choice (MCQ) grammar flashcards, real-time assessment results, and direct statement editing capabilities.

---

## 🌟 Key Features

1. **Secure Authentication**
   * Professional split-screen landing/auth page matching Figma mockups.
   * Secure user signup and login flow using JSON Web Tokens (JWT) and `bcryptjs`.
2. **Interactive MCQ Flashcards**
   * Sleek card-based user interface for taking grammar tests.
   * State management for active, previous, and next question states.
3. **Assessment Results & Analytical Review**
   * Instant congratulations screen upon test completion.
   * Collapsible **Detailed Analysis** inline toggle showing correct answers, explanation, and references.
   * Comprehensive list of grammar rules used for the statements.
4. **Direct Statement Management**
   * Edit button to modify statements and grammatical rules directly in the database via the **Edit Page**.
   * Instant updates reflected dynamically in active tests.
5. **Obsidian Twilight Style**
   * High-fidelity dark slate-gray and twilight themed CSS styles.
   * Fluent hover effects, animations, clean layouts, and typography.
6. **One-Click Launch**
   * A batch file launcher (`run-app.bat`) to spin up both frontend and backend dev servers simultaneously and automatically open the application in the default browser.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Vanilla CSS, Lucide React icons
* **Backend**: Node.js, Express.js, Mongoose (MongoDB ORM)
* **Authentication**: JWT (JSON Web Tokens), BCrypt.js
* **Database**: MongoDB (Local or Atlas)
* **DevOps/Scripts**: Batch script (`run-app.bat`)

---

## 📂 Project Structure

```
PurpleZone/
├── run-app.bat          # Main launcher script (Windows)
├── backend/             # Node.js + Express backend
│   ├── config/          # DB connection configuration
│   ├── controllers/     # Controller logic for auth and statements
│   ├── middleware/      # Auth verification middleware
│   ├── models/          # Mongoose Schemas (Statement, Submission, User, MockDb)
│   ├── routes/          # Express API endpoints
│   ├── scripts/         # DB Seeding script (seed.js)
│   ├── server.js        # Entry point for backend
│   ├── .env             # Environment variables
│   └── package.json
└── frontend/            # React + Vite frontend
    ├── public/
    ├── src/
    │   ├── components/  # Page-level components (AuthPage, TestPage, EditPage, ResultPage)
    │   ├── App.jsx      # Main application routing and core logic
    │   ├── App.css      # Core component styles
    │   ├── index.css    # Premium CSS design system, colors, utilities
    │   └── main.jsx     # Vite entrypoint
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on standard port `27017` (or custom MongoDB Atlas connection string).

### Setup and Installation

1. **Clone the repository** (if not already done).
2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file inside the `backend` directory (a default one is provided):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/purplezone
   JWT_SECRET=purplezone_dev_secret_key_987654321
   ```
4. **Seed the Database**:
   Seed the database with sample grammar questions/statements:
   ```bash
   npm run seed
   ```
5. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 💻 Running the Application

### The Easy Way (Windows Launcher)

Double-click `run-app.bat` in the root folder, or run it in your terminal:
```bash
./run-app.bat
```
This automatically starts the backend server, the frontend Vite dev server, and opens [http://localhost:5173](http://localhost:5173) in your default web browser.

### The Manual Way (Multi-Terminal)

If you are on macOS/Linux or prefer manual execution:

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   *Runs at [http://localhost:5000](http://localhost:5000)*

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   *Runs at [http://localhost:5173](http://localhost:5173)*

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
* `POST /register` - Register a new user account.
* `POST /login` - Login to an existing account and obtain JWT token.
* `GET /me` - Get current authenticated user details (requires JWT).

### Statements/Questions Routes (`/api/statements`)
* `GET /` - Fetch all grammar statements (requires authentication).
* `PUT /:id` - Edit a specific grammar statement (requires authentication).
* `POST /submit` - Submit answers and save test submission (requires authentication).
