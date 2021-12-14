require('dotenv').config();

const cors = require('cors')// might want to remove before going to prod
 
var boatsRouter = require('./controllers/boats');
var ownersRouter = require('./controllers/owners');
var historiesRouter = require('./controllers/histories');
var photosRouter = require('./controllers/photos');
var aircrashRouter = require('./controllers/aircrash');
var catalogsRouter = require('./controllers/catalogs');
var usersRouter = require('./controllers/users');
var peopleRouter = require('./controllers/people');

var knex = require('knex');
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var _ = require('lodash');
// app.use(cors({
//   origin: '*',
//   optionsSuccessStatus: 200,
//   credentials: true
// }));
// app.all('*', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","POST, PUT, GET, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Ocp-Apim-Subscription-Key");
  next();
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
console.log("host: ", process.env.DB_HOST);
console.log("user: ",process.env.DB_USER);
console.log("psss: ",process.env.DB_PASS);
console.log("db name: ",process.env.DB_NAME);


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
app.use('/api/catalogs', catalogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/people', peopleRouter);

console.log(`Database Info: ${process.env.DB_HOST} ${process.env.DB_NAME}, `,port);
app.listen(port);