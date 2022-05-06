require('dotenv').config()
const express = require('express')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt') // for hashing passwords
const cors = require('cors')
const app = express()
const db = require('./queries')

// CONSTANTS
const PORT = 3000
const SALT_ROUNDS = 10
const TWO_HOURS = 1000 * 60 * 60 * 2

app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// SESSION MANAGEMENT
const store = new pgSession({
  pool: db.pool, // Connection pool
  tableName: 'user_sessions', // Use another table-name than the default "session" one
  // onnect-pg-simple options
  createTableIfMissing: true,
})

app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    store: store,
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    name: process.env.SESSION_ID,
    cookie: { secure: false, maxAge: TWO_HOURS, sameSite: true },
  })
)

// AUTH ROUTES
app.post('/api/register/test', async (req, res) => {
  const { username, email, password } = req.body

  // check if user exists
  let user
  if (username && email && password) {
    user = await db.pool.query(
      'SELECT * FROM users WHERE username=$1 OR email=$2;',
      [username, email]
    )
  }
  user = user.rows.pop()

  if (!user) {
    // create the user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    let newUser = await db.pool.query(
      'INSERT INTO users(username, password, email) VALUES ($1, $2, $3)',
      [username, hashedPassword, email]
    )

    newUser = await db.pool.query(
      'SELECT id, username, email FROM users WHERE username=$1 AND email=$2',
      [username, email]
    )
    newUser = newUser.rows.pop()

    req.session.user = newUser
    console.log(req.session)

    return res.send({ user: newUser })
  } else {
    return res.send({ isRegistered: 'user already registered' })
  }
})

// bcrypt.compare('password', hash, function (err, result) {});

// APP ROUTES
app.get('/sup', db.checkConnection, db.getNotes)

app.post('/add', db.checkConnection, db.addNote)

app.post('/add/foldername', db.checkConnection, db.addFolderName)

app.put('/update', db.checkConnection, db.updateNote)

app.delete('/delete/:id', db.checkConnection, db.deleteNote)

app.delete('/delete/folder/:id', db.checkConnection, db.deleteFolder)

app.put('/update/folder', db.checkConnection, db.updateFolder)

app.listen(process.env.PORT || PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
