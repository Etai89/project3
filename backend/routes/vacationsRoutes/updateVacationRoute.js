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
const upload_1 = __importDefault(require("../../middlewares/upload"));
const db_1 = __importDefault(require("../../config/db"));
const router = (0, express_1.Router)();
router.put('/vacations/:id', auth_1.authMiddleware, auth_1.isAdmin, upload_1.default.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { destination, description, start_date, end_date, price } = req.body;
        const numericPrice = parseFloat(price);
        if (!destination || !description || !start_date || !end_date || isNaN(numericPrice)) {
            return res.status(400).json({ msg: 'Missing or invalid fields' });
        }
        let image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        // אם לא נשלחה תמונה חדשה – שלוף את הישנה מה-DB
        if (!image) {
            const [rows] = yield db_1.default.execute('SELECT image FROM vacations WHERE id = ?', [id]);
            if (!rows.length)
                return res.status(404).json({ msg: 'Vacation not found' });
            image = rows[0].image;
        }
        yield db_1.default.execute('UPDATE vacations SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image = ? WHERE id = ?', [destination, description, start_date, end_date, numericPrice, image, id]);
        res.json({ msg: 'Vacation updated successfully' });
    }
    catch (error) {
        console.error('Update error:', error.message);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
}));
exports.default = router;
