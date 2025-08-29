🚀 Node.js Express API with JWT & Redis

This repository contains a Node.js REST API built with Express.js.
It demonstrates the use of CommonJS modules, JWT authentication, and Redis caching/session management.

📌 Features

Node.js (CommonJS) – backend runtime environment.

Express.js – fast, minimal, and flexible web framework.

JWT (JSON Web Tokens) – stateless authentication.

Redis – for caching and token/session management.

RESTful API – clean and structured endpoints.

📂 Project Structure
project-root/
│── controllers/
│── middlewares/
│── routes/
│── utils/
│── app.js
│── server.js
│── package.json


⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name


Install dependencies:

npm install


Setup environment variables in .env:

PORT=5000
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379


Run the app in development:

npm run dev

🔑 Authentication Flow (JWT + Redis)

User Login → API verifies credentials.

JWT Issued → Access token + Refresh token generated.

Redis stores refresh tokens for validation & blacklist.

Protected Routes → Access token required in headers.

Token Refresh → Refresh token endpoint provides new access token.

📌 Example Endpoints
Auth Routes
POST /api/auth/register   # Register new user
POST /api/auth/login      # Login & receive tokens
POST /api/auth/refresh    # Refresh expired access token
POST /api/auth/logout     # Invalidate token (stored in Redis)



🛠️ Technologies Used

Node.js

Express.js

JSON Web Token

Redis

🚀 Deployment

Can be deployed on Render, Railway, Heroku, or Docker.

Redis can be hosted using Upstash or Redis Cloud.

📜 License

This project is licensed under the MIT License – feel free to use and modify for your own projects.