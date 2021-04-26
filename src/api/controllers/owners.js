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

router.put('/:ownerId', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('edit')) res.sendStatus(403);

  const { ownerId } = req.params;


  const { owner = {}, ownerAlias = [] } = req.body;
  const { OwnerName } = owner;

  //make the update
  await db('boat.owner')
      .update({ OwnerName })
      .where('boat.boat.id', ownerId);

  const newArray = [];
  const editArray = [];

  ownerAlias.forEach(alias => {
    // if statements or switch statement depending on how you want to split
    if (alias.id) editArray.push(alias);
    else newArray.push({ OwnerId: ownerId, ...alias });
  });

  await db.insert(newArray)
    .into('boat.OwnerAlias')
    .returning('*')
    .then(rows => {
      return rows;
    });
  
  for (const obj of editArray) {
    await db('boat.OwnerAlias')
    .update(obj.Alias)
    .where('boat.OwnerAlias.id', alias.Id);
  }

  res.status(200).send({ message: 'success' });
});

router.post('/new', authenticateToken, async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { owner = {}, ownerAlias = [] } = req.body;
  
  const response = await db.insert(owner)
    .into('boat.owner')
    .returning('*')
    .then(async rows => {
      const newOwner = rows[0];

      if (ownerAlias.length) {
        const newOwnerAlias = ownerAlias.map(alias => ({ ...alias, OwnerId: newOwner.Id }))

        await db.insert(newOwnerAlias)
        .into('boat.OwnerAlias')
        .returning('*')
        .then(rows => {
          return rows;
        });
      }

      return newOwner;
    });

  res.status(200).send(response);
});

module.exports = router;