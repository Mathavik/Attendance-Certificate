import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import sequelize from "./models";
import certificateRoutes from "./routes/certificateRoutes";

dotenv.config();

const app = express();

// Configure CORS to allow your React app to send credentials (like cookies)
const corsOptions = {
  // Replace with the exact URL of your React app
  origin: "http://localhost:3000",
  // This is required to allow cookies/credentials to be sent with requests
  credentials: true,
};
app.use(cors(corsOptions));

// This middleware parses the incoming JSON payload from the request body
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/certificates", certificateRoutes);


// DB sync & start
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // in dev you can use { alter: true }
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (e) {
    console.error("DB connection error:", e);
    process.exit(1);
  }
})();


