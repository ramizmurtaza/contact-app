// server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { sequelize, connectDB } from "./src/config/database.js";

// IMPORTANT: import models BEFORE sync()
import "./src/models/User.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

const startServer = async () => {
  // 1. Connect to MySQL
  await connectDB();

  // 2. Sync database (create/update tables)
  await sequelize.sync({ alter: true });
  console.log("🔄 Database synced!");

  // 3. Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();
