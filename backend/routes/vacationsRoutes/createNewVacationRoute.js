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
router.post('/vacations', auth_1.authMiddleware, auth_1.isAdmin, upload_1.default.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { destination, description, start_date, end_date, price } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        console.log('BODY:', req.body);
        console.log('FILE:', req.file);
        if (!destination || !description || !start_date || !end_date || !price || !image) {
            return res.status(400).json({ msg: 'All fields are required' });
        }
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 10000) {
            return res.status(400).json({ msg: 'Invalid price' });
        }
        yield db_1.default.execute('INSERT INTO vacations (destination, description, start_date, end_date, price, image) VALUES (?, ?, ?, ?, ?, ?)', [destination, description, start_date, end_date, numericPrice, image]);
        res.status(201).json({ msg: 'Vacation created successfully' });
    }
    catch (error) {
        console.error('Vacation creation error:', error.message);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
}));
exports.default = router;
