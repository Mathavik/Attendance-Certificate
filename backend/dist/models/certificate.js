"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class Certificate extends sequelize_1.Model {
}
Certificate.init({
    studentName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    collegeName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    fromDate: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    toDate: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    certificateTitle: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    certificateContent: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    signatoryTitle: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    attendanceTotalDays: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    attendanceDaysAttended: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    attendancePercentage: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    internshipTitle: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    internshipCompletionTitle: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    position: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    department: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    reportingManager: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    location: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    hideReportingManager: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hidePosition: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hideDepartment: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hideLocation: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    wishMessage: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    signatureImage: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
}, {
    sequelize: index_1.default,
    modelName: "Certificate",
    tableName: "certificates",
    timestamps: true,
});
exports.default = Certificate;
