const express = require('express');
const Note = require('../class/note');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile , deleteFromFile} = require('../helpers/fsUtils');



const app = express();

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

app.get('/notes', (req, res) =>{
    readFromFile('./lib/db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;    
    deleteFromFile('./lib/db/db.json',noteId);
    res.json('Note deleted successfully.');
});

module.exports = app;
