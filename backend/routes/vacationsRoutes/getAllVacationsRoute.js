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
const router = (0, express_1.Router)();
router.get('/vacations', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const filter = req.query.filter; // "future" | "active" | "followed"
        let query = `
      SELECT v.*, 
        EXISTS(SELECT * FROM followers WHERE user_id = ? AND vacation_id = v.id) AS is_following,
        (SELECT COUNT(*) FROM followers WHERE vacation_id = v.id) AS followers_count
      FROM vacations v
    `;
        const params = [userId];
        if (filter === 'future') {
            query += ' WHERE v.start_date > CURDATE()';
        }
        else if (filter === 'active') {
            query += ' WHERE v.start_date <= CURDATE() AND v.end_date >= CURDATE()';
        }
        else if (filter === 'followed') {
            query += `
        JOIN followers f ON v.id = f.vacation_id
        WHERE f.user_id = ?
      `;
            params.push(userId); // כי יש פעמיים ?
        }
        query += ' ORDER BY v.start_date ASC';
        const [rows] = yield db_1.default.execute(query, params);
        res.json(rows);
    }
    catch (error) {
        console.error('Get vacations error:', error.message);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
}));
exports.default = router;
