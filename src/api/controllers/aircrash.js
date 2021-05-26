var express = require('express');
var router = express.Router();

var authenticateToken = require('../middlewares');
var _ = require('lodash');//added for testing
router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

router.get('/', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');

  const { page = 0, limit = 10, textToMatch = '' } = req.query;
  const offset = (page*limit) || 0;
  const counter = await db.from('dbo.vAircrash').count('yacsinumber', {as: 'count'});
  let aircrashes = [];
  console.log(textToMatch);
  if (textToMatch) {
    aircrashes = await db.select('*')
    .from('dbo.vAircrash')
    .where('yacsinumber', 'like', `%${textToMatch}%`)
    .orWhere('crashdate', 'like', `%${textToMatch}%`)
    .orWhere('aircrafttype', 'like', `%${textToMatch}%`)
    .orWhere('aircraftregistration', 'like', `%${textToMatch}%`)
    .orWhere('nation', 'like', `%${textToMatch}%`)
    .orWhere('militarycivilian', 'like', `%${textToMatch}%`)
    .orWhere('crashlocation', 'like', `%${textToMatch}%`)
    .orWhere('pilot', 'like', `%${textToMatch}%`)
    .orWhere('soulsonboard', 'like', `%${textToMatch}%`)
    .orWhere('injuries', 'like', `%${textToMatch}%`)
    .orWhere('fatalities', 'like', `%${textToMatch}%`);
    
  } else {
    aircrashes = await db.select('*')
      .from('dbo.vAircrash')
      .orderBy('dbo.vAircrash.yacsinumber', 'asc')
      .limit(limit).offset(offset);
  }
    
  res.status(200).send({ count: counter[0].count, body: aircrashes });
});

router.get('/:aircrashId', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const { aircrashId } = req.params;

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const aircrash = await db.select('*')
      .from('dbo.vAircrash')
      .where('dbo.vAircrash.yacsinumber', aircrashId)
      .first();
  
  aircrash.infoSources = await db.select('*')
  .from('AirCrash.InfoSource')
  .where('AirCrash.InfoSource.YACSINumber', aircrashId);

  if (!aircrash) {
      res.status(403).send('Airplane crash id not found');
      return
  };

  res.status(200).send(aircrash);
});

router.put('/:aircrashId', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('edit')) res.sendStatus(403);

  const { aircrashId } = req.params;

  const { aircrash = {}, 
  removedInfoSources,
  newInfoSources, 
  editedInfoSources } = req.body;

  //make the update
  await db('AirCrash.AirCrash')
      .update(aircrash)
      .where('AirCrash.AirCrash.yacsinumber', aircrashId);


  //Add the new info sources (in progress)
  console.log(newInfoSources);
  await db.insert(newInfoSources.map(source => ({ YACSINumber: aircrashId, ...source })))
  .into('AirCrash.InfoSource')
  .then(rows => {
    return rows;
  });

  //remove the previous owners (DONE)
  for (const obj of removedInfoSources) {
    await db('AirCrash.InfoSource')
    .where('AirCrash.InfoSource.Id', obj.Id)
    .del();
  }

  //update the info sources (DONE)
  for (const obj of editedInfoSources) {
    await db('AirCrash.InfoSource')
    .update({Source: obj.Source})
    .where('AirCrash.InfoSource.Id', obj.Id);
  }

  res.status(200).send({ message: 'success' });
});

router.post('/new', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { aircrash = {}, newInfoSources } = req.body;
/*
  const response = await db.insert(aircrash)
    .into('AirCrash.AirCrash')
    .returning('*');
*/
  const response = await db.insert(aircrash)
    .into('AirCrash.AirCrash')
    .returning('*')
    .then(async rows => {
      const newAirCrash = rows[0];

      if (newInfoSources.length) {
        const finalInfoSources = newInfoSources.map(source => ({ YACSINumber: newAirCrash.YACSINumber, ...source }))

        await db.insert(finalInfoSources)
        .into('AirCrash.InfoSource')
        .returning('*')
        .then(rows => {
          return rows;
        });
      }

      return newAirCrash;
    });

  res.status(200).send(response);

});

module.exports = router;