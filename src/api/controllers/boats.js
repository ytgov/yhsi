var express = require('express');
var router = express.Router();
var authenticateToken = require('../utils');

router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

router.get('/', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');

  const { page = 0, limit = 10 } = req.query;
  const offset = (page*limit) || 0;

  const boats = await db.select('*')
    .from('boat.boat')
    .orderBy('boat.boat.id', 'asc')
    .limit(limit).offset(offset);
    
  for (const boat of boats) {    
    boat.owners = await db.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName')
      .from('boat.boatowner')
      .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
      .where('boat.boatowner.boatid', boat.Id);
  }

  res.status(200).send(boats);
});
  
router.get('/:boatId', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const { boatId } = req.params;

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const boat = await db.select('*')
      .from('boat.boat')
      .where('boat.boat.id', boatId)
      .first();

  if (!boat) {
      res.status(403).send('Boat id not found');
      return
  };

  boat.owners = await db.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName')
    .from('boat.boatowner')
    .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
    .where('boat.boatowner.boatid', boatId);
  
  boat.histories = await db.select('*')
    .from('boat.history')
    .where('boat.history.uid', boatId);

  res.status(200).send(boat);
});

router.post('/new', authenticateToken, async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { boat = {}, owners = [], histories = [] } = req.body;
  
  const response = await db.insert(boat)
    .into('boat.boat')
    .returning('*')
    .then(async rows => {
      const newBoat = rows[0];

      if (owners.length) {
        const newOwners = owners.map(owner => ({ ...owner, BoatId: newBoat.Id }))

        await db.insert(newOwners)
        .into('boat.boatowner')
        .returning('*')
        .then(rows => {
          return rows;
        });
      }

      if (histories.length) {
        const newHistories = histories.map(history => ({ ...history, UID: newBoat.Id }))
        await db.insert(newHistories)
        .into('boat.history')
        .returning('*')
        .then(rows => {
          return rows;
        });
      }

      return newBoat;
    });

  res.status(200).send(response);
});

module.exports = router