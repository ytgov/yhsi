require('dotenv').config();

const cors = require('cors')// might want to remove before going to prod
 
var boatsRouter = require('./controllers/boats');
var ownersRouter = require('./controllers/owners');
var historiesRouter = require('./controllers/histories');
var photosRouter = require('./controllers/photos');
var aircrashRouter = require('./controllers/aircrash');


var knex = require('knex');
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var _ = require('lodash');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(cors()); //only for dev ** remove if its not needed for prod

var conn = knex({
  client: 'mssql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    options: {
      enableArithAbort: true,
    }
  },
  useNullAsDefault: true 
});

app.set("db", conn);

// URI for tediousJS = `mssql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?encrypt=true`
app.get('/', function (req, res) {
  const db = req.app.get('db');

  db.raw("SELECT TOP 1 * FROM Boat.Owner;")
    .then(rows => {
      if (rows.length > 0) { 
        console.log(rows);
        res.status(200).send("Successful Connection");
        return
      }
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("ERROR: Either the connection to the database isn't working or the query is incorrect");
    });
});

app.use('/api/boats', boatsRouter);
app.use('/api/owners', ownersRouter);
app.use('/api/histories', historiesRouter);
app.use('/api/photos', photosRouter);
app.use('/api/aircrash', aircrashRouter);

console.log(`Database Info: ${process.env.DB_HOST} ${process.env.DB_NAME}, `,port);
app.listen(port);