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
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// routes imports
const testRoute_1 = __importDefault(require("./routes/testRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
let db;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        db = yield promise_1.default.createConnection(dbConfig);
        console.log('Connected to MySQL database');
        // Create the buildings table
        yield db.execute(`
            CREATE TABLE IF NOT EXISTS buildings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                building_name VARCHAR(255) NOT NULL
            )
        `);
        // Create the rooms table
        yield db.execute(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                building_id INT NOT NULL,
                room_name TEXT
            )
        `);
        // Create the bookings table
        yield db.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_id INT NOT NULL,
                startDate DATETIME NOT NULL,
                endDate DATETIME NOT NULL,
                description TEXT
            )
        `);
        console.log('Database setup complete');
    }
    catch (err) {
        console.error('Error connecting to MySQL:', err);
    }
});
connectDB();
app.get('/', (req, res) => {
    res.json("Wellcome to 'enter' route!");
});
app.use('/enter', testRoute_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
