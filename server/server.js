require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // for hashing passwords
const cors = require('cors');
const app = express();
const db = require('./queries');

// CONSTANTS
const PORT = 3000;
const SALT_ROUNDS = 10;
const TWO_HOURS = 1000 * 60 * 60 * 2;

app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// SESSION MANAGEMENT
const store = new pgSession({
  pool: db.pool, // Connection pool
  tableName: 'user_sessions', // Use another table-name than the default "session" one
  // onnect-pg-simple options
  createTableIfMissing: true,
});

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    store: store,
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    name: process.env.SESSION_ID,
    cookie: { secure: false, maxAge: TWO_HOURS, sameSite: true },
  })
);

// AUTH MIDDLEWARES
const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    res.send({ isAuthenticated: false });
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.user) {
    res.send({ isAuthenticated: true });
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.send({ isAuthenticated: false });
  }
};
// AUTH ROUTES
// TODO:
// - implement login check middleware to check if req.session already has a user set

app.post('/api/register/test', async (req, res) => {
  const { username, email, password } = req.body;

  // check if user exists
  let user;
  if (username && email && password) {
    user = await db.pool.query(
      'SELECT * FROM users WHERE username=$1 OR email=$2;',
      [username, email]
    );
  }
  user = user.rows.pop();

  if (!user) {
    // create the user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    let newUser = await db.pool.query(
      'INSERT INTO users(username, password, email) VALUES ($1, $2, $3)',
      [username, hashedPassword, email]
    );

    newUser = await db.pool.query(
      'SELECT id, username, email FROM users WHERE username=$1 AND email=$2',
      [username, email]
    );
    newUser = newUser.rows.pop();

    req.session.user = newUser;
    console.log(req.session);

    return res.send({ user: newUser });
  } else {
    return res.send({ isRegistered: 'user already registered' });
  }
});

app.post('/api/login/test', redirectHome, async (req, res) => {
  console.log('inside login post');
  const { email, password } = req.body;

  // check if the user exists
  let user = await db.pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (user.rows.length) {
    user = user.rows.find((e) => e.email === email);
    let isMatch = await bcrypt.compare(password, user.password);
    // passwords match
    if (isMatch) {
      req.session.user = user;
      res.send({ isAuthenticated: true });
    } else {
      res.send({ isAuthenticated: false });
    }
  }
});

app.get('/api/login', async (req, res) => {
  if (req.session.user) {
    res.send({ isAuthenticated: true });
  } else {
    res.send({ isAuthenticated: false });
  }
});

app.post('/api/logout/test', redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ error: 'could not logout user', success: false });
    } else {
      res.clearCookie(process.env.SESSION_ID);
      res.send({ success: true });
    }
  });
});

// APP ROUTES
app.get('/sup', isLoggedIn, db.checkConnection, db.getNotes);

app.post('/add', isLoggedIn, db.checkConnection, db.addNote);

app.post('/add/foldername', isLoggedIn, db.checkConnection, db.addFolderName);

app.put('/update', isLoggedIn, db.checkConnection, db.updateNote);

app.delete('/delete/:id', isLoggedIn, db.checkConnection, db.deleteNote);

app.delete(
  '/delete/folder/:id',
  isLoggedIn,
  db.checkConnection,
  db.deleteFolder
);

app.put('/update/folder', isLoggedIn, db.checkConnection, db.updateFolder);

app.listen(process.env.PORT || PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
