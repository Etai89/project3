import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv'

// routes imports
import TestRoute from './routes/testRoute';

dotenv.config()

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

let db: mysql.Connection;

const connectDB = async () => {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');

        // Create the buildings table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS buildings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                building_name VARCHAR(255) NOT NULL
            )
        `);

        // Create the rooms table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                building_id INT NOT NULL,
                room_name TEXT
            )
        `);

        // Create the bookings table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_id INT NOT NULL,
                startDate DATETIME NOT NULL,
                endDate DATETIME NOT NULL,
                description TEXT
            )
        `);

        console.log('Database setup complete');
    } catch (err) {
        console.error('Error connecting to MySQL:', err);
    }
};

connectDB();
app.get('/', (req: Request, res: Response)=>{

    res.json("Wellcome to 'enter' route!")
})


app.use('/enter', TestRoute)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
