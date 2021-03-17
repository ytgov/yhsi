require('dotenv').config();

var knex = require('knex');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var sqlite3 = require('sqlite3');
sqlite3.verbose();
var open = require('sqlite').open;

// this is a top-level await 
(async () => {
  // open the database
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  })

  await db.run(`CREATE TABLE IF NOT EXISTS to_notify (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    preferredLanguage text, 
    notificationTelephone text, 
    specimenId text UNIQUE)`,
    (err) => {
      if (err) {
          console.log("🚀 ----------------------------------------")
          console.log("🚀 ~ file: server.js ~ line 27 ~ err", err)
          console.log("🚀 ----------------------------------------")
          // Table already created
      } else {
          // Table just created, creating some rows
      }
    }
  );

})();


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
  }
});

app.set("db", conn);

// URI for tediousJS = `mssql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?encrypt=true`
app.get('/', function (req, res) {
  const db = req.app.get('db');

  db.raw("SELECT TOP 1 * FROM dbo.CovidTestResults;")
    .then(rows => {
      if (rows.length > 0) { 
        res.status(200).send("Successful Connection");
        return
      }
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("ERROR: Either the connection to the database isn't working or the query is incorrect");
    })
});

app.put('/test-result', (req, res) => {
  const db = req.app.get('db');
  const { body } = req;

  if (!body.lastName || !body.healthCareNumber || !body.birthDate) {
    res.status(400).send("Bad request");
    return
  }
  console.log(body);
  const healthCareNumber = body.healthCareNumber.replace(/-/g, '');
  const dob = body.birthDate.replace(/-/g, '');
  const lastName = body.lastName;

  db.raw(`
    SELECT TOP 1 *
      FROM dbo.CovidTestResults
      WHERE dbo.CovidTestResults.HCN = '${healthCareNumber}' AND
        dbo.CovidTestResults.DOB = '${dob}' AND
        dbo.CovidTestResults.LastName = '${lastName.toUpperCase()}'
        ORDER BY dbo.CovidTestResults.CollectionDateTime DESC;`)
    .then(rows => {
      if (rows.length == 0) { 
        res.status(404).send("Test was found, please check back later.");
        return
      }

      const result = rows[0];

      if (result.Result === null || (result.Result && result.Result.indexOf('Negative') < 0)){
        console.log('result', result);
        res.status(204).send("The test result is not yet ready.");
        return
      }

      const responseBody = {
        "patientName": result.PatientName.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
        // "lastName": result.lastName,
        "birthDate": result.DOB.substring(0, 4) + "-" + result.DOB.substring(4, 6) + '-' + result.DOB.substring(6, result.DOB.length),
        // "specimenCollected": "Nasopharyngeal swab",
        "collectionTimestamp": result.CollectionDateTime,
        "resultEnteredTimestamp": result.ResultedDateTime,
        "result": result.Result
      }

      res.json(responseBody);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("ERROR: Either the connection to the database isn't working or the query is incorrect");
    })
});

app.put('/notification-request', async (req, res) => {
  const msdb = req.app.get('db');
  const { body } = req;

  if (!body.lastName || !body.healthCareNumber || !body.birthDate || !body.notificationTelephone || !body.preferredLanguage) {
    res.status(400).send("Bad request");
    return
  }

  const healthCareNumber = body.healthCareNumber.replace(/-/g, '');
  const dob = body.birthDate.replace(/-/g, '');
  const lastName = body.lastName;

  msdb.raw(`
    SELECT *
      FROM dbo.CovidTestResults
      WHERE dbo.CovidTestResults.HCN = '${healthCareNumber}' AND
        dbo.CovidTestResults.DOB = '${dob}' AND
        dbo.CovidTestResults.LastName = '${lastName.toUpperCase()}'
        ORDER BY dbo.CovidTestResults.CollectionDateTime DESC;`)
    .then(rows => {
      if (rows.length == 0) { 
        res.status(404).send("Test was found, please check back later.");
        return
      }
      const result = rows[0] || {};
      const specimenId = result.SpecimenID;

      (async () => {
        // open the database
        const db = await open({
          filename: './database.db',
          driver: sqlite3.Database
        })

        try {
          var insert = 'INSERT INTO to_notify (specimenId, notificationTelephone, preferredLanguage) VALUES (?,?,?)';
          const result = await db.run(insert, [specimenId, body.notificationTelephone, body.preferredLanguage]);
          console.log("🚀 ---------------------------------------------------------")
          console.log("🚀 ~ file: server.js ~ line 137 ~ app.put ~ Success result", result)
          console.log("🚀 ---------------------------------------------------------")
          res.status(200).send({ message: "Successfully requested" });
        } catch (error) {
        console.log("🚀 ---------------------------------------------")
        console.log("🚀 ~ file: server.js ~ line 170 ~ error", error)
        console.log("🚀 ---------------------------------------------")
          
          res.status(403).send(error.code);
        }
        
      })();
    
    })
    .catch((e) => {
      console.error(e.code);
      res.status(500).send("ERROR: Either the connection to the database isn't working or the query is incorrect");
    })
});

app.get('/to-notify', async (req, res) => {
  // open the database
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  })

  var query = 'Select specimenId, notificationTelephone, preferredLanguage from to_notify where specimenId is not null';
  const result = await db.all(query);
  res.status(200).send(result);
});

console.log(`Database Info: ${process.env.DB_HOST} ${process.env.DB_NAME}`)

app.listen(port);