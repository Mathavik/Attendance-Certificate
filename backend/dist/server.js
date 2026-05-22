"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const models_1 = __importDefault(require("./models"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Configure CORS to allow your React app to send credentials (like cookies)
const corsOptions = {
    // Replace with the exact URL of your React app
    origin: "http://localhost:3000",
    // This is required to allow cookies/credentials to be sent with requests
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// This middleware parses the incoming JSON payload from the request body
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("/api/certificates", certificateRoutes_1.default);
// DB sync & start
(async () => {
    try {
        await models_1.default.authenticate();
        await models_1.default.sync(); // in dev you can use { alter: true }
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
    }
    catch (e) {
        console.error("DB connection error:", e);
        process.exit(1);
    }
})();
