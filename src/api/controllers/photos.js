var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');
var multer = require('multer');
// const cors = require('cors')// 
// router.use(cors());
// router.all('*', cors());
const upload = multer();

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

router.post('/new', [authenticateToken, upload.single('file')], async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { BoatId, ...restBody } = req.body;
  const body = { File: req.file.buffer, ...restBody }

  const response = await db.insert(body)
    .into('dbo.photo')
    .returning('*')
    .then(async rows => {
      const newBoatPhoto = rows[0];

      await db.insert({ BoatId, Photo_RowID: newBoatPhoto.RowId })
        .into('boat.photo')
        .returning('*')
      .then(rows => {
        return rows;
      });

      return newBoatPhoto;
    });
  
  res.status(200).send({ message: 'Upload Success' });
});

module.exports = router