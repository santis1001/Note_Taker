// Include required Packages for the functionality of the app
const express = require('express');
const Note = require('../class/note');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile , deleteFromFile} = require('../helpers/fsUtils');


// create an Express app
const app = express();

// POST route for creating new note
// Extracts the body from the request body
// Initialize an Object using Note constructor and generate an unique id
// appends the new note to the JSON file
// returns JSON with new note
app.post('/notes', (req, res) => {
    const { Title, Content} = req.body;
    if (Title && Content) {
        const new_note = new Note (
            uuidv4(),
            Title,
            Content            
        );

        readAndAppend(new_note.toJSON(), './lib/db/db.json');

        const response = {
            status: 'success',
            body: new_note,
        };

        res.json(response);
    } else {
        res.json('Error in posting Note');
    }
});

// GET route for fetching all notes
// Read the JSON file and returns the response
app.get('/notes', (req, res) =>{
    readFromFile('./lib/db/db.json').then((data) => res.json(JSON.parse(data)));
});

// DELETE route for deleting a notes by ID
// extracts the id from the request parameters
// Delete the note from the array and save the data into the file
app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;    
    deleteFromFile('./lib/db/db.json',noteId);
    res.json('Note deleted successfully.');
});

// Exports the Express app
module.exports = app;
