var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');

router.get('/', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');
  const { page = 0, limit = 10 } = req.query;
  const offset = (page*limit) || 0;
  const counter = await db.from('boat.boatowner').count('ownerid', {as: 'count'});
  const owners = await db.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName', 'boat.owner.id')
    .distinct('boat.boatowner.ownerid')
    .from('boat.boatowner')
    .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
    .orderBy('boat.boatowner.ownerid', 'asc')
    .limit(limit).offset(offset);

    res.status(200).send({count: counter[0].count, body: owners});
});

router.get('/:ownerId', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');
  const { ownerId } = req.params;
  const owner = await db.select('*')
    .distinct('boat.boatowner.ownerid')
    .from('boat.boatowner')
    .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
    .where('boat.boatowner.ownerid', ownerId)
    .first();
  
  owner.boats = await db.select('*')
    .from('boat.boat')
    .join('boat.BoatOwner', 'boat.BoatOwner.boatid', '=', 'boat.boat.id')
    .where('boat.boatowner.ownerid', ownerId);

  owner.histories = await db.select('*')
    .from('boat.history')
    .where('boat.history.uid', ownerId);
  
  owner.alias = await db.select('*')
    .from('boat.owneralias')
    .where('boat.owneralias.ownerid', ownerId);

  res.status(200).send(owner);
});


module.exports = router