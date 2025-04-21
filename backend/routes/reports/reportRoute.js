"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const db_1 = __importDefault(require("../../config/db"));
const json2csv_1 = require("json2csv");
const router = (0, express_1.Router)();
// Get report data
router.get('/reports/vacations', auth_1.authMiddleware, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.execute(`
            SELECT v.destination, COUNT(f.user_id) AS followers
            FROM vacations v
            LEFT JOIN followers f ON v.id = f.vacation_id
            GROUP BY v.destination
        `);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
}));
// Download CSV
router.get('/reports/vacations/csv', auth_1.authMiddleware, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.execute(`
            SELECT v.destination, COUNT(f.user_id) AS followers
            FROM vacations v
            LEFT JOIN followers f ON v.id = f.vacation_id
            GROUP BY v.destination
        `);
        const parser = new json2csv_1.Parser({ fields: ['destination', 'followers'] });
        const csv = parser.parse(rows);
        res.header('Content-Type', 'text/csv');
        res.attachment('vacation_report.csv');
        res.send(csv);
    }
    catch (error) {
        res.status(500).json({ msg: 'CSV generation error' });
    }
}));
exports.default = router;
