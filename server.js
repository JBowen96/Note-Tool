const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const db = require('./db/db.json')

//Allows notes to have unique IDs
const { v4: uuidv4 } = require('uuid');

//unblock pub folder
app.use(express.static('public'))
app.use(express.json())

//API Routes
// GET /api/notes should read the db.json file and return all saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        ///error logging
        if (err) throw err;
        let dbData = JSON.parse(data);
        //Returns new database
        res.json(dbData)
    });
})




//DELETE
// notes when the button is clicked by removing the note from db.json
app.delete('/api/notes/:id', (req, res) => {
    const newDb = db.filter((note) =>
        note.id !== req.params.id)

    // update the db.json file to reflect the modified notes array
    fs.writeFileSync('./db/db.json', JSON.stringify(newDb))

    // send that removed note object back to user
    readFile.json(newDb)
})

//POST 
///api/notes receives a new note to save on the request
app.post('/api/notes', (req, res) => {
    //grabs notes from body of request
    const newNote = req.body

    //gives each note a random ID
    newNote.id = uuidv4()

    //adds the note object to the array
    db.push(newNote)

    //update the json file with the new object
    fs.writeFileSync('./db/db.json', JSON.stringify(db))

    //responds with the note object used
    res.json(db)
})

//HTML Routes
//Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

//Wildcard Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//App listens with front end on this port
app.listen(PORT, () =>
    console.log(`App listening on ${PORT}`))