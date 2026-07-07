import QRCode from "qrcode";
import { Op } from "sequelize";
import Certificate from "../models/certificate";
import dotenv from "dotenv";

dotenv.config();

export async function generateSerialNumber(): Promise<string> {
    const year = new Date().getFullYear();

    const count = await Certificate.count({
        where: {
            createdAt: {
                [Op.gte]: new Date(year, 0, 1),
                [Op.lt]: new Date(year + 1, 0, 1),
            },
        },
    });

    const sequence = String(count + 1).padStart(3, "0");

    return `PCS-${year}-${sequence}`;
}

export async function generateQRCode(
  serialNumber: string
): Promise<string> {

  // Frontend URL
  const frontendUrl =
    process.env.FRONTEND_URL || "http://192.168.1.5:3000";

  const verifyUrl = `${frontendUrl}/verify/${serialNumber}`;

  return await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 2,
  });
}