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

  
router.get('/:crashId', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const { crashId } = req.params;

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const crash = db.select('*')
  .from('dbo.vAircrash');

  if (!crash) {
      res.status(403).send('Crash site id not found');
      return
  };

  res.status(200).send(crash);
});

module.exports = router;