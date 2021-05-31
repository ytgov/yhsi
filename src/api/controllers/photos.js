var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');
var multer = require('multer');
var _ = require('lodash');
// const cors = require('cors')// 
// router.use(cors());
// router.all('*', cors());
const upload = multer();


//GET ALL AVAILABLE PHOTOS
router.get('/', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');
  const { page = 0, limit = 5, textToMatch } = req.query;
  const offset = (page*limit) || 0;
  let photos = [];
  let counter = 0;

  if(textToMatch){

    counter = await db.from('dbo.photo as PH')
    .join('dbo.Community as CO', 'PH.CommunityId',  '=', 'CO.Id')
    .join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
    .where('PH.FeatureName', 'like', `%${textToMatch}%`)
    .orWhere('PH.OriginalFileName', 'like', `%${textToMatch}%`)
    .orWhere('PH.Address', 'like', `%${textToMatch}%`)
    .orWhere('PH.Caption', 'like', `%${textToMatch}%`)
    .orWhere('CO.Name', 'like', `%${textToMatch}%`)
    .orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`)
    .count('RowId', {as: 'count'});

    photos = await db.column('PH.*',{ CommunityName: 'CO.Name'}, { PlaceName: 'PL.PrimaryName'})
    .select() 
    .from('dbo.photo as PH')
    .join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
    .join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
    .where('FeatureName', 'like', `%${textToMatch}%`)
    .orWhere('OriginalFileName', 'like', `%${textToMatch}%`)
    .orWhere('Address', 'like', `%${textToMatch}%`)
    .orWhere('Caption', 'like', `%${textToMatch}%`)
    .orWhere('CO.Name', 'like', `%${textToMatch}%`)
    .orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`)
    .orderBy('PH.RowId', 'asc')
    .limit(limit).offset(offset);
  }
  else{
    counter = await db.from('dbo.photo').count('RowId', {as: 'count'});

    photos = await db.column('PH.*',{ CommunityName: 'CO.Name'}, { PlaceName: 'PL.PrimaryName'})
    .select() 
    .from('dbo.photo as PH')
    .join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
    .join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
    .orderBy('PH.RowId', 'asc')
    .limit(limit).offset(offset);
  }

  res.status(200).send({ count: counter[0].count, body: photos });
});


//LINK BOAT PHOTOS  
router.post('/boat/link/:BoatId', [authenticateToken, upload.single('file')], async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { BoatId } = req.params;
  const { linkPhotos } = req.body;

  let currentPhotos = await db.select('Photo_RowID').from('boat.Photo').where('BoatId', BoatId)
  let filteredLinkPhotos = _.difference(linkPhotos, currentPhotos.map(x => {return x.Photo_RowID}))

  for(const rowId of filteredLinkPhotos)
    await db.insert({ BoatId, Photo_RowID: rowId })
      .into('boat.photo')
      .returning('*')
    .then(rows => {
      return rows;
    });
  res.status(200).send({ message: 'Successfully linked the photos' });
});

//LINK AIRCRASH PHOTOS  
router.post('/aircrash/link/:AirCrashId',  authenticateToken, async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { AirCrashId } = req.params;
  const { linkPhotos } = req.body;
  let currentPhotos = await db.select('Photo_RowID').from('AirCrash.Photo').where('YACSINumber', AirCrashId)
  let filteredLinkPhotos = _.difference(linkPhotos, currentPhotos.map(x => {return x.Photo_RowID}))

  for(const rowId of filteredLinkPhotos)
    await db.insert({ YACSINumber: AirCrashId, Photo_RowID: rowId })
      .into('AirCrash.Photo')
      .returning('*')
    .then(rows => {
      return rows;
    });

  res.status(200).send({ message: 'Successfully linked the photos' });
});


//GET BOAT PHOTOS
router.get('/boat/:boatId', authenticateToken, async (req, res) => {
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

// GET AIRCRASH PHOTOS
router.get('/aircrash/:aircrashId', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);
  const { aircrashId } = req.params;

  const db = req.app.get('db');
  const { page = 0, limit = 10 } = req.query;
  const offset = (page*limit) || 0;

  const photos = await db.select('*')
    .from('AirCrash.Photo as AP')
    .join('dbo.photo', 'AP.Photo_RowID', '=', 'dbo.photo.RowID')
    .where('AP.YACSINumber', aircrashId)
    .limit(limit).offset(offset);

  res.status(200).send(photos);
});

// ADD NEW BOAT PHOTO
router.post('/boat/new', [authenticateToken, upload.single('file')], async (req, res) => {
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


// ADD NEW AIRCRASH PHOTO
router.post('/aircrash/new', [authenticateToken, upload.single('file')], async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { YACSINumber, ...restBody } = req.body;
  const body = { File: req.file.buffer, ...restBody }

  const response = await db.insert(body)
    .into('dbo.photo')
    .returning('*')
    .then(async rows => {
      const newAirCrashPhoto = rows[0];

      await db.insert({ YACSINumber, Photo_RowID: newAirCrashPhoto.RowId })
        .into('AirCrash.Photo')
        .returning('*')
      .then(rows => {
        return rows;
      });

      return newAirCrashPhoto;
    });
  
  res.status(200).send({ message: 'Upload Success' });
});

module.exports = router