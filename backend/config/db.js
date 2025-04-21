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
exports.initDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.default = pool;
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield pool.getConnection();
        yield connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255),
                role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
            )
        `);
        yield connection.execute(`
            CREATE TABLE IF NOT EXISTS vacations (
                id INT PRIMARY KEY AUTO_INCREMENT,
                destination VARCHAR(100),
                description TEXT,
                start_date DATE,
                end_date DATE,
                price DECIMAL(10,2),
                image VARCHAR(255)
            )
        `);
        yield connection.execute(`
            CREATE TABLE IF NOT EXISTS followers (
                user_id INT,
                vacation_id INT,
                PRIMARY KEY(user_id, vacation_id),
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(vacation_id) REFERENCES vacations(id)
            )
        `);
        connection.release();
        console.log('✅ MySQL database initialized');
    }
    catch (err) {
        console.error('DB ERROR:', err.message);
    }
});
exports.initDB = initDB;
