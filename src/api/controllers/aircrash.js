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

  const { page = 0, limit = 10, textToMatch = '', sortBy = 'yacsinumber', sort = 'asc' } = req.query;
  const offset = (page*limit) || 0;
  let counter = 0;
  let aircrashes = [];

  if (textToMatch) {
    counter = await db.from('dbo.vAircrash')
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
    .orWhere('fatalities', 'like', `%${textToMatch}%`)
    .count('yacsinumber', {as: 'count'});

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
    .orWhere('fatalities', 'like', `%${textToMatch}%`)
    //.orderBy('yacsinumber', 'asc')
    .orderBy(`${sortBy}`,`${sort}`)
    .limit(limit).offset(offset);

  } else {
    counter = await db.from('dbo.vAircrash').count('yacsinumber', {as: 'count'});
    aircrashes = await db.select('*')
      .from('dbo.vAircrash')
      //.orderBy('dbo.vAircrash.yacsinumber', 'asc')
      .orderBy(`${sortBy}`,`${sort}`)
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

  if(newInfoSources.length > 0){
    await db.insert(newInfoSources.map(source => ({ YACSINumber: aircrashId, ...source })))
    .into('AirCrash.InfoSource')
    .then(rows => {
      return rows;
    });
  }

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

  const exists = await db.select('*')
  .from('dbo.vAircrash')
  .where('dbo.vAircrash.yacsinumber', aircrash.yacsinumber)
  .first();

  if(exists){
    res.status(409).send('The YACSI Number already exists');
    return;
  }

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


router.get('/available_yacsi/:YACSINumber', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');

  const { YACSINumber } = req.params;
  let available = true;

  const exists = await db.select('*')
  .from('dbo.vAircrash')
  .where('dbo.vAircrash.yacsinumber', YACSINumber)
  .first();

  if(exists){
    available = false;
  }

  res.status(200).send({ available });
});

module.exports = router;