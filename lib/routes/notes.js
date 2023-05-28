const express = require('express');
const Note = require('../class/note');
const { v4: uuidv4 } = require('uuid');



const app = express();

app.post('/notes/', (req, res) => {
    const { Title, Content} = req.body;
    if (Title && Content) {
        const new_note = new Note (
            uuidv4(),
            Title,
            Content            
        );

        readAndAppend(new_note.toJSON(), '../db/db.json');

        const response = {
            status: 'success',
            body: new_note,
        };

        res.json(response);
    } else {
        res.json('Error in posting feedback');
    }
});

app.get('/notes/:id', (req, res) =>
    readFromFile('../db/db.json').then((data) => res.json(JSON.parse(data)))
);

app.delete('/notes/:id', (req, res) => {
    const userId = req.params.id;    
    res.send(`User ${userId} deleted successfully.`);
});

module.exports = app;
