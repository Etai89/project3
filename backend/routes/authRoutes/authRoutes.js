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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../config/db"));
const router = (0, express_1.Router)();
router.post('/registration', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, password } = req.body;
        const [existingUsers] = yield db_1.default.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0)
            return res.status(400).json({ msg: 'User already exists' });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield db_1.default.execute('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', [first_name, last_name, email, hashedPassword]);
        res.status(201).json({ msg: 'User registered successfully' });
    }
    catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const [rows] = yield db_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user)
            return res.status(400).json({ msg: 'Email not found' });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.first_name, role: user.role }, process.env.SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
}));
exports.default = router;
