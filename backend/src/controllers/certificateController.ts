import { Request, Response } from "express";
import Certificate from "../models/certificate";
import { generateSerialNumber, generateQRCode } from "../utils/certificateHelpers";
export const createCertificate = async (req: Request, res: Response) => {
  try {
    const serialNumber = await generateSerialNumber();
    const qrCode = await generateQRCode(serialNumber);
    const certificate = await Certificate.create({
      ...req.body,
      serialNumber,
      qrCode,
    });
    return res.status(201).json(certificate);
  } catch (error) {
    console.error("Certificate create error:", error);
    return res.status(500).json({ message: "Unable to create certificate." });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByPk(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found." });
    }
    // Prevent overriding serialNumber and qrCode from request body
    delete req.body.serialNumber;
    delete req.body.qrCode;
    await certificate.update(req.body);
    return res.json(certificate);
  } catch (error) {
    console.error("Certificate update error:", error);
    return res.status(500).json({ message: "Unable to update certificate." });
  }
};
export const getCertificateBySerial = async (req: Request, res: Response) => {
  try {
    const { serialNumber } = req.params;
    const certificate = await Certificate.findOne({ where: { serialNumber } });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found." });
    }
    // Exclude sensitive fields if any, or send everything needed
    return res.json(certificate);
  } catch (error) {
    console.error("Certificate fetch by serial error:", error);
    return res.status(500).json({ message: "Unable to fetch certificate." });
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
    const sequelize = Certificate.sequelize!;

    const stats = await Certificate.findAll({
      attributes: [
        [
          sequelize.fn(
            "UPPER",
            sequelize.fn(
              "TRIM",
              sequelize.fn(
                "REPLACE",
                sequelize.col("certificateTitle"),
                "  ",
                " "
              )
            )
          ),
          "certificateTitle",
        ],
        [
          sequelize.fn("COUNT", sequelize.col("id")),
          "count",
        ],
      ],
      group: [
        sequelize.fn(
          "UPPER",
          sequelize.fn(
            "TRIM",
            sequelize.fn(
              "REPLACE",
              sequelize.col("certificateTitle"),
              "  ",
              " "
            )
          )
        ),
      ],
      raw: true,
    });

    return res.json(stats);
  } catch (error) {
    console.error("Certificate stats error:", error);
    return res.status(500).json({ message: "Unable to fetch certificate stats." });
  }
};
