import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,       
  process.env.DB_USER as string,       // root
  process.env.DB_PASSWORD as string,   // your MySQL password
  {
    dialect: "mysql",                  // change from mssql → mysql
    host: process.env.DB_SERVER || "localhost",
    port: Number(process.env.DB_PORT) || 3306, // default MySQL port is 3306
    logging: false,                    // optional: disable SQL logs
  }
);

export default sequelize;
