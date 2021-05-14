var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');

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

router.post('/new', authenticateToken, async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { history = {} } = req.body;

  const response = await db.insert(history)
    .into('boat.History')
    .returning('*');

  res.status(200).send(response);

});

router.put('/:historyId', authenticateToken, async (req, res) => {
  const db = req.app.get('db');
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('edit')) res.sendStatus(403);

  const { history } = req.body;
  const { historyId } = req.params;
  //make the update
  await db('boat.History')
      .update(history)
      .where('boat.History.id', historyId);

  res.status(200).send({ message: 'success' });
});

module.exports = router;