"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getCertificates = exports.createCertificate = void 0;
const certificate_1 = __importDefault(require("../models/certificate"));
const createCertificate = async (req, res) => {
    try {
        const certificate = await certificate_1.default.create(req.body);
        return res.status(201).json(certificate);
    }
    catch (error) {
        console.error("Certificate create error:", error);
        return res.status(500).json({ message: "Unable to create certificate." });
    }
};
exports.createCertificate = createCertificate;
const getCertificates = async (_req, res) => {
    try {
        const certificates = await certificate_1.default.findAll({ order: [["createdAt", "DESC"]] });
        return res.json(certificates);
    }
    catch (error) {
        console.error("Certificate fetch error:", error);
        return res.status(500).json({ message: "Unable to fetch certificates." });
    }
};
exports.getCertificates = getCertificates;
const getStats = async (_req, res) => {
    try {
        const stats = await certificate_1.default.findAll({
            attributes: ["certificateTitle", [certificate_1.default.sequelize.fn("COUNT", certificate_1.default.sequelize.col("id")), "count"]],
            group: ["certificateTitle"],
            raw: true,
        });
        return res.json(stats);
    }
    catch (error) {
        console.error("Certificate stats error:", error);
        return res.status(500).json({ message: "Unable to fetch certificate stats." });
    }
};
exports.getStats = getStats;
