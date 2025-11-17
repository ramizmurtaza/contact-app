import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false
  }
);

export const connectDB = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established successfully');
    return true;
  } catch (error: any) {
    console.error('Unable to connect to the database:', error?.message || error);
    return false;
  }
};