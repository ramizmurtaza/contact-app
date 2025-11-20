import dotenv from 'dotenv';
import { sequelize, connectDB } from './database/database.js';
import app from './app.js';
import { registerModels } from './database/index.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const startServer = async () => {
  const connected = await connectDB();
  if (connected) {
    registerModels(sequelize);
    await sequelize.sync({ alter: true }); // Apply schema changes to existing tables without the help of migrations
  } else {
    console.warn('Skipping sequelize.sync due to database connection failure');
  }
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
  });
};

startServer();