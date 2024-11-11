// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'user123', // replace with your MySQL password
    database: 'user_data' // the database you created
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create User
app.post('/api/users', (req, res) => {
    const { name, age, phone, address } = req.body;
    const sql = 'INSERT INTO users (name, age, phone, address) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, age, phone, address], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(400).json({ error: 'Error inserting data' });
        }
        res.json({ id: result.insertId, name, age, phone, address });
    });
});

// Get All Users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(400).json({ error: 'Error fetching users' });
        }
        res.json(results);
    });
});

// Update User
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, phone, address } = req.body;
    const sql = 'UPDATE users SET name = ?, age = ?, phone = ?, address = ? WHERE id = ?';
    
    db.query(sql, [name, age, phone, address, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(400).json({ error: 'Error updating user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id, name, age, phone, address });
    });
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(400).json({ error: 'Error deleting user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
