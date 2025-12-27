# SubSentry Backend Module 🛠️

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## 📌 Overview

This module establishes the backend foundation for **SubSentry**. It initializes an Express server with a robust directory structure and secure MongoDB connection logic.

## 🚀 Key Features

- **Modular Structure**: Separated configuration (`config/db.js`) from the main entry point (`server.js`).
- **Security**: Environment variables are managed via `dotenv` and not committed to version control.
- **Error Handling**: Graceful handling of database connection failures.

## 🛠️ Project Structure

```bash
contributors/Your_Username/server/
├── config/
│   └── db.js           # 🗄️ Database Connection Logic
├── .env                # 🔐 Environment Variables (Not committed)
├── .gitignore          # 🚫 Ignored files (node_modules, .env)
├── server.js           # 🚀 Server Entry Point
└── package.json        # 📦 Dependencies
```

## ⚡ Getting Started

### 1. Installation

Navigate to the server directory and install dependencies:

```bash
cd contributors/MK-codes365/server
npm install
```

### 2. Configuration

Create a `.env` file in the root of the `server` folder:

```properties
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 3. Run the Server

```bash
node server.js
```

If the connection is successful, you will see:

```
Server running on port 5000
MongoDB Connected: ...
```

---

_Built for SubSentry OpenCode'25_
