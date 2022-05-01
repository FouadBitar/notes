require('dotenv').config()
console.log(typeof process.env.APP_USER)

const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const path = require('path')
const app = express()
const port = 3000




app.use(cors())

const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/sup', db.getNotes)

app.post('/add', db.addNote)

app.post('/add/foldername', db.addFolderName)

app.put('/update', db.updateNote)

app.delete('/delete/:id', db.deleteNote)

app.get('/test', (req, res) => {
  res.send("hello this is the test");
})

  
app.listen((process.env.PORT || port), () => {
    console.log(`App running on port ${port}.`)
})