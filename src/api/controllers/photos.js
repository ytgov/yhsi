var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');

router.get('/:boatId', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);
  const { boatId } = req.params;

  const db = req.app.get('db');
  const { page = 0, limit = 10 } = req.query;
  const offset = (page*limit) || 0;

  const photos = await db.select('*')
    .from('boat.photo as BP')
    .join('dbo.photo', 'BP.Photo_RowID', '=', 'dbo.photo.RowID')
    .where('BP.boatid', boatId)
    .limit(limit).offset(offset);

  res.status(200).send(photos);
});

module.exports = router