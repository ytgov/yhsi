var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');

router.get('/', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');
  const { page = 0, limit = 2 } = req.query;
  const offset = (page*limit) || 0;

  const photos = await db.select('*', 'boat.Owner.OwnerName')
    .from('dbo.photo')
    .join('boat.BoatOwner', 'boat.BoatOwner.ownerid', '=', 'dbo.photo.id')
    .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
    // .orderBy('boat.boatowner.ownerid', 'asc')
    .limit(limit).offset(offset);

  res.status(200).send(photos);
});

module.exports = router