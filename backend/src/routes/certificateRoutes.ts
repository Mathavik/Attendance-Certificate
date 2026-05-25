import express from "express";
import { createCertificate, updateCertificate, getCertificates, getStats } from "../controllers/certificateController";

const router = express.Router();

router.post("/", createCertificate);
router.put("/:id", updateCertificate);
router.get("/stats", getStats);
router.get("/", getCertificates);

export default router;
