import express from "express";
import { createCertificate, getCertificates, getStats } from "../controllers/certificateController";

const router = express.Router();

router.post("/", createCertificate);
router.get("/stats", getStats);
router.get("/", getCertificates);

export default router;
