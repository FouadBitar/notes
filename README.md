# Notes Web Application

This project is a web application for taking and organizing notes. The application is built using React for the frontend, node and express for the backend server and a postgresql database.

## Running Development

First clone the project.

```
git clone https://github.com/FouadBitar/notes.git
```

Then install the dependencies using npm.

```
npm i
```

For development a postgresql server should be running locally.
Set up the environment variables or define in the queries.js file the following required information to connect to the database:

```
PGHOST='HOST'
PGUSER='USER_NAME'
PGDATABASE='DATABASE'
PGPASSWORD='PASSWORD'
```

Then start the server by changing into the 'server' directory and running either of the following commands:

```
nodemon
npm start
```

Finally, from the root folder, run the following line to start the frontend server with the help of the react-scripts framework:

```
npm start
```
