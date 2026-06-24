import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Certificate extends Model { }

Certificate.init(
  {
    studentName: { type: DataTypes.STRING, allowNull: false },
    collegeName: { type: DataTypes.STRING, allowNull: false },
    fromDate: { type: DataTypes.STRING, allowNull: false },
    toDate: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    certificateTitle: { type: DataTypes.STRING, allowNull: false },
    projectTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certificateContent: { type: DataTypes.TEXT, allowNull: true },
    signatoryTitle: { type: DataTypes.STRING, allowNull: true },
    attendanceTotalDays: { type: DataTypes.STRING, allowNull: true },
    attendanceDaysAttended: { type: DataTypes.STRING, allowNull: true },
    attendancePercentage: { type: DataTypes.STRING, allowNull: true },
    internshipTitle: { type: DataTypes.STRING, allowNull: true },
    internshipCompletionTitle: { type: DataTypes.STRING, allowNull: true },
    position: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    reportingManager: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    hideReportingManager: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hidePosition: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hideDepartment: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hideLocation: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    wishMessage: { type: DataTypes.TEXT, allowNull: true },
    signatureImage: { type: DataTypes.TEXT, allowNull: true },

  },
  {
    sequelize,
    modelName: "Certificate",
    tableName: "certificates",
    timestamps: true,
  }
);

export default Certificate;


// ALTER TABLE certificate.certificates
// ADD COLUMN projectTitle VARCHAR(255) NULL
// AFTER certificateTitle;