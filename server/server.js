const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
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

app.get('/', db.getNotes)

app.post('/add', db.addNote)

app.put('/update', db.updateNote)

app.delete('/delete/:id', db.deleteNote)

  
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})