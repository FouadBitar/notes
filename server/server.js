require("dotenv").config();
console.log(typeof process.env.APP_USER);

const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

const db = require("./queries");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// ROUTES
app.get("/sup", db.checkConnection, db.getNotes);

app.post("/add", db.checkConnection, db.addNote);

app.post("/add/foldername", db.checkConnection, db.addFolderName);

app.put("/update", db.checkConnection, db.updateNote);

app.delete("/delete/:id", db.checkConnection, db.deleteNote);

// TEST ROUTES
app.get("/test", (req, res) => {
  res.send("hello this is the test");
});

app.post("/test", (req, res) => {
  res.send("still got the put test");
});

app.listen(process.env.PORT || port, () => {
  console.log(`App running on port ${port}.`);
});
