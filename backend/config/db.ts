import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool

export const initDB = async () => {
    try {
        const connection = await pool.getConnection()

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255),
                role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
            )
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS vacations (
                id INT PRIMARY KEY AUTO_INCREMENT,
                destination VARCHAR(100),
                description TEXT,
                start_date DATE,
                end_date DATE,
                price DECIMAL(10,2),
                image VARCHAR(255)
            )
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS followers (
                user_id INT,
                vacation_id INT,
                PRIMARY KEY(user_id, vacation_id),
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(vacation_id) REFERENCES vacations(id)
            )
        `)

        connection.release()
        console.log('✅ MySQL database initialized')
    } catch (err: any) {
        console.error('DB ERROR:', err.message)
    }
}
