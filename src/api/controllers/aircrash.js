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

  if (textToMatch) {
    aircrashes = await db.select('*')
    .from('dbo.vAircrash')
    .where('name', 'like', `%${textToMatch}%`);
    
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

  const { aircrash = {} } = req.body;

  //make the update
  await db('AirCrash.AirCrash')
      .update(aircrash)
      .where('AirCrash.AirCrash.yacsinumber', aircrashId);

  res.status(200).send({ message: 'success' });
});


module.exports = router;