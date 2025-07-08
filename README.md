# MKA-Meet: Video Conferencing and Collaborative Platform

MKA-Meet is a full-stack web application that provides real-time video conferencing, chat, and a collaborative code editor. It's designed for developers, teams, and anyone needing an interactive space for remote collaboration.

## ✨ Features

- **Real-time Video/Audio:** High-quality video and audio streaming for seamless communication.
- **Live Chat:** Instant messaging within each collaboration room.
- **Collaborative Code Editor:** A shared code editor for pair programming and technical interviews.
- **User Authentication:** Secure user registration and login system.
- **Room-based Sessions:** Create or join unique rooms for private collaboration sessions.

## 🛠️ Tech Stack

This project is a monorepo with a separate frontend and backend.

**Frontend:**
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** CSS (with potential for a framework like Tailwind CSS or Material-UI)
- **State Management:** React Context API
- **Routing:** React Router

**Backend:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time Communication:** (Likely) WebSockets (e.g., Socket.IO)

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
    The backend will be running on `http://localhost:3000`.

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
