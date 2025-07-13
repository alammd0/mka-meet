# MKA-Meet: Video Conferencing and Collaborative Platform

MKA-Meet is a full-stack web application that provides real-time video conferencing, chat, and a collaborative code editor. It's designed for developers, teams, and anyone needing an interactive space for remote collaboration.

## ✨ Features


- **User Authentication:** Secure user registration and login system using JWT.
- **Room Management:** Create, join, and view a list of collaboration rooms.
- **Real-time Communication:** WebSocket-based communication for real-time interactions.
- **(In Progress) Real-time Video/Audio:** High-quality video and audio streaming.
- **(In Progress) Live Chat:** Instant messaging within each collaboration room.
- **(In Progress) Collaborative Code Editor:** A shared code editor for pair programming.


## 🛠️ Tech Stack

This project is a monorepo with a separate frontend and backend.

**Frontend:**
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Routing:** React Router
- **Real-time Communication:** Socket.IO Client
- **Notifications:** React Toastify

**Backend:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time Communication:** Socket.IO

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd mka-meet
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file in the `backend` directory by copying the example:
      ```
      # .env
      DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
      JWT_SECRET="your-super-secret-jwt-key"
      ```
    - Run database migrations:
      ```bash
      npx prisma generate
      npx prisma migrate dev
      ```
    - Start the backend server:
      ```bash
      npm run dev
      ```
    The backend will be running on `http://localhost:4000`.

3.  **Setup the Frontend:**
    - In a new terminal, navigate to the frontend directory:
      ```bash
      cd frontend
      npm install
      ```
    - Start the frontend development server:
      ```bash
      npm run dev
      ```
    The frontend will be accessible at `http://localhost:5173`.

## 📂 Project Structure

```
mka-meet/
├── backend/        # Node.js, Express, Prisma
│   ├── prisma/
│   └── src/
└── frontend/       # React, Vite, TypeScript
    └── src/
        ├── components/
        ├── context/
        └── page/
```

## Project Status

This project is currently under active development. The core features like user authentication and room management are functional. The real-time video/audio, chat, and collaborative editor features are in progress.
