"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const certificateController_1 = require("../controllers/certificateController");
const router = express_1.default.Router();
router.post("/", certificateController_1.createCertificate);
router.get("/stats", certificateController_1.getStats);
router.get("/", certificateController_1.getCertificates);
exports.default = router;
