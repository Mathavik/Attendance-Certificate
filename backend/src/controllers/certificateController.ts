import { Request, Response } from "express";
import Certificate from "../models/certificate";

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.create(req.body);
    return res.status(201).json(certificate);
  } catch (error) {
    console.error("Certificate create error:", error);
    return res.status(500).json({ message: "Unable to create certificate." });
  }
};

export const getCertificates = async (_req: Request, res: Response) => {
  try {
    const certificates = await Certificate.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(certificates);
  } catch (error) {
    console.error("Certificate fetch error:", error);
    return res.status(500).json({ message: "Unable to fetch certificates." });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await Certificate.findAll({
      attributes: ["certificateTitle", [Certificate.sequelize!.fn("COUNT", Certificate.sequelize!.col("id")), "count"]],
      group: ["certificateTitle"],
      raw: true,
    });
    return res.json(stats);
  } catch (error) {
    console.error("Certificate stats error:", error);
    return res.status(500).json({ message: "Unable to fetch certificate stats." });
  }
};
