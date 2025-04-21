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
router.delete('/followers/:vacationId', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const vacationId = parseInt(req.params.vacationId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield db_1.default.execute('DELETE FROM followers WHERE user_id = ? AND vacation_id = ?', [userId, vacationId]);
        res.json({ msg: 'Unfollowed vacation successfully' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
}));
exports.default = router;
