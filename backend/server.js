// Import required modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true })); // For form data
app.use(bodyParser.json()); // For JSON data




console.log('Static files directory:', path.join(__dirname, '../frontend'));
app.use(express.static(path.join(__dirname,'../frontend'))); // server frontend files


//static middleware
console.log('Static files served from:', path.join(__dirname, '../static'));
app.use(express.static(path.join(__dirname, '../static')));


// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',       // Database host
    user: 'root',            // Database username
    password: 'system',    // Database password
    database: 'book_club'    // Database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Routes
// Create a test route

// serve the homepage 
app.get('/', (req, res) => {
    const homepagePath = path.join(__dirname, '../frontend/index.html');
    console.log('Homepage path:', homepagePath); // Log the homepage path
    res.sendFile(homepagePath);
});

//serve the registration page
app.get('/', (req, res) => {
    const registerPagePath = path.join(__dirname, '../frontend/register.html');
    console.log('Register page path:', registerPagePath); // Log the register page path
    res.sendFile(registerPagePath);
});



// Route to register a user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Error registering user.');
        } 
        console.log('User registered: ', result);
            res.redirect('/login');
    });
});

//static folder
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html')); // Serve register.html
});

//serve the login page
app.get('/login', (req, res) => {
    const loginPagePath = path.join(__dirname, '../frontend/login.html');
    console.log('Login page path:', loginPagePath); // Log the login page path
    res.sendFile(loginPagePath);
});


// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Login failed.');
        }
        if (results.length > 0) {
            console.log('User logged in:', results[0]);
            res.redirect('/club'); // Redirect to the book club page
        } else {
            res.send('Invalid credentials. <a href="/login">Try again</a>');
        }
    });
});

//static folder
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html')); // Serve login.html
});


// Serve the book club page
app.get('/club', (req, res) => {
    const sql = 'SELECT * FROM book_clubs'; // Query to fetch all book clubs
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching book clubs:', err);
            return res.status(500).send('Error fetching book clubs.');
        }
        // Send the HTML file with the clubs data
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/styles.css">
                <title>Your Book Clubs</title>
            </head>
            <body>
                <header>
                    <h1>Your Book Clubs</h1>
                </header>
                <main>
                    <section>
                        <h2>Create a New Book Club</h2>
                        <form action="/create-club" method="POST">
                            <label for="name">Club Name:</label>
                            <input type="text" id="name" name="name" required>
                            <label for="description">Description:</label>
                            <textarea id="description" name="description" required></textarea>
                            <button type="submit">Create Club</button>
                        </form>
                    </section>
                    <section>
                        <h2>Your Clubs</h2>
                        <ul>
                            ${results.map(club => `<li>${club.name}: ${club.description}</li>`).join('')}
                        </ul>
                    </section>
                </main>
            </body>
            </html>
        `);
    });
});


// Handle book club creation
app.post('/create-club', (req, res) => {
    const { name, description } = req.body;
    const sql = 'INSERT INTO book_clubs (name, description) VALUES (?, ?)';
    db.query(sql, [name, description], (err, result) => {
        if (err) {
            console.error('Error creating book club:', err);
            return res.status(500).send('Failed to create book club.');
        }
        console.log('Book club created:', result);
        res.redirect('/club'); // Redirect back to the book club page
    });
});

// Start the server
app.listen(3001, () => {
    console.log(`Server running on http://localhost:3001`);
});
