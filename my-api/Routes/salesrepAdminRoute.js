import express from 'express';
import pool from '../utils/db.js'; // Corrected import path
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * FROM salesAdmin WHERE email = $1 AND password = $2"; // Use positional parameters for PostgreSQL
    pool.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            return res.json({ loginStatus: false, Error: "Query Error" });
        }

        if (result.rows.length > 0) { // Use result.rows for PostgreSQL
            const email = result.rows[0].email;
            const token = jwt.sign(
                { role: "admin", email: email },
                "jwt_secret_key",
                { expiresIn: "1d" } // Changed from "id" to "1d" for 1 day expiry
            );

            res.cookie('token', token); // Corrected to use res.cookie
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

export { router as adminRouter };
