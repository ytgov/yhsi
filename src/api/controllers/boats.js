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
  const counter = await db.from('boat.boat').count('Id', {as: 'count'});
  let boats = [];

  if (textToMatch) {
    boats = await db.select('*')
    .from('boat.boat')
    .where('name', 'like', `%${textToMatch}%`);
    
  } else {
    boats = await db.select('*')
      .from('boat.boat')
      .orderBy('boat.boat.id', 'asc')
      .limit(limit).offset(offset);
  }
    
  for (const boat of boats) {    
    boat.owners = await db.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName')
      .from('boat.boatowner')
      .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
      .where('boat.boatowner.boatid', boat.Id);
  }

  res.status(200).send({ count: counter[0].count, body: boats });
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

  boat.pastNames = await db.select('*')
  .from('boat.pastnames')
  .where('boat.pastnames.boatid', boatId);

  boat.owners = await db.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName', 'boat.owner.id' )//added boat.owner.id to the query (I need this for the details button)
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

router.put('/:boatId', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('edit')) res.sendStatus(403);

  const { boat = {}, ownerNewArray = [], ownerRemovedArray = [],
          pastNamesNewArray = [], pastNamesEditArray = [] } = req.body;
  const { boatId } = req.params;
  //make the update

  await db('boat.boat')
      .update(boat)
      .where('boat.boat.id', boatId);


  //Add the new owners (done)
  await db.insert(ownerNewArray.map(owner => ({ BoatId: boatId, ...owner })))
    .into('boat.boatowner')
    .then(rows => {
      return rows;
    });

  //remove the previous owners (needs work)
  for (const obj of ownerRemovedArray) {
    await db('boat.boatowner')
    .where('boat.boatowner.ownerid', obj.Id);
  }

  //update the past names (needs work)
  for (const obj of pastNamesEditArray) {
    await db('boat.pastnames')
    .update({BoatName: obj.BoatName})
    .where('boat.pastnames.Id', obj.Id)
    .andWhere('boat.pastnames.BoatId', boatId);
  }

  //Add the new past names (done)
  await db.insert(pastNamesNewArray.map(name => ({ BoatId: boatId, ...name })))
  .into('boat.pastnames')
  .then(rows => {
    return rows;
  });

  res.status(200).send({ message: 'success' });
});

module.exports = router;