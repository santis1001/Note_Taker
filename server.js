// Include required Packages for the functionality of the app
const express = require('express');
const path = require('path');
const api = require('./lib/routes/notes');

// Set the port number for the server or use the environment port
// create an Express app
const PORT = process.env.PORT || 3001;
const app = express();

// MIDDLE WARE
// Parse to JSON the requests
// Parse URL encoded request
// Use custom API route for the /api prefix
// Server static files from the lib/public directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
app.use(express.static('lib/public'));

// GET Route for homepage
// send the index.html as the response
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './lib/public/index.html'))
);

// GET Route for notes page
// send the notes.html as the response
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './lib/public/notes.html'))
);

// start the server
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
