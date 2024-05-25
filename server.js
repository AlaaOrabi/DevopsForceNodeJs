const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors=require('cors');

const path = require('path');
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors ({origin: '*'}));
// MySQL connection configuration
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main HTML file
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle insertion of a new book
app.post('/process_insert', function(req, res) {
    const book = req.body;
    const sql = "INSERT INTO book (title, description, price, category) VALUES (?, ?, ?, ?)";
    con.query(sql, [book.title, book.description, book.price, book.category], function(err, result) {
        if (err) {
            console.error('Error inserting book:', err);
            res.status(500).send('Error inserting book');
            return;
        }
        res.send('Book inserted successfully');
    });
});

// Route to fetch all books
app.get('/process_index', function(req, res) {
    const sql = "SELECT * FROM book";
    con.query(sql, function(err, rows, fields) {
        if (err) {
            console.error('Error fetching books:', err);
            res.status(500).send('Error fetching books');
            return;
        }
        res.json(rows);
    });
});
app.put('/process_update', function(req, res) {
    const book = req.body;
    const sql = "UPDATE book SET title = ?, description = ?, price = ?, category = ? WHERE id = ?";
    con.query(sql, [book.title, book.description, book.price, book.category, book.id], function(err, result) {
        if (err) {
            console.error('Error updating book:', err);
            res.status(500).send('Error updating book');
            return;
        }
        res.send('Book updated successfully');
    });
});

// Route to delete a book
app.delete('/process_delete', function(req, res) {
    const bookId = req.body.id;
    const sql = "DELETE FROM book WHERE id = ?";
    con.query(sql, [bookId], function(err, result) {
        if (err) {
            console.error('Error deleting book:', err);
            res.status(500).send('Error deleting book');
            return;
        }
        res.send('Book deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
