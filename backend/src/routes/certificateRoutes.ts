import express from "express";
import { createCertificate, updateCertificate, getCertificates, getStats, getCertificateBySerial } from "../controllers/certificateController";

const router = express.Router();

router.post("/", createCertificate);
router.put("/:id", updateCertificate);
router.get("/stats", getStats);
router.get("/", getCertificates);
router.get('/verify/:serialNumber', getCertificateBySerial);
export default router;
