var express = require('express');
var router = express.Router();
var authenticateToken = require('../utils');

router.get('/', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');
  const { page = 0, limit = 10 } = req.query;
  const offset = (page*limit) || 0;

  const histories = await db.select('*')
    .from('Boat.History')
    // .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
    // .orderBy('boat.boatowner.ownerid', 'asc')
    .where('boat.history.uid', boatId)
    .limit(limit).offset(offset);

  res.status(200).send(histories);
});

module.exports = router