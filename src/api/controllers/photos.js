var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');
var multer = require('multer');
var _ = require('lodash');
const imageThumbnail = require('image-thumbnail');
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


//LINK PERSON PHOTOS  
router.post('/people/link/:PersonID', [authenticateToken, upload.single('file')], async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { PersonID } = req.params;
  const { linkPhotos } = req.body;

  let currentPhotos = await db.select('PhotoID').from('Person.Photo').where('PersonID', PersonID)
  let filteredLinkPhotos = _.difference(linkPhotos, currentPhotos.map(x => {return x.Photo_RowID}))

  for(const rowId of filteredLinkPhotos)
    await db.insert({ PersonID, PhotoID: rowId })
      .into('Person.Photo')
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


//GET PERSON PHOTOS
router.get('/people/:PersonID', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);
  const { PersonID } = req.params;

  const db = req.app.get('db');
  const { page = 0, limit = 10 } = req.query;
  const offset = (page*limit) || 0;

  const photos = await db.select('*')
    .from('Person.Photo as PP')
    .join('dbo.photo', 'PP.PhotoID', '=', 'dbo.photo.RowID')
    .where('PP.PersonID', PersonID)
    .limit(limit).offset(offset);
  res.status(200).send(photos);
});

// ADD NEW BOAT PHOTO
router.post('/boat/new', [authenticateToken, upload.single('file')], async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { BoatId, ...restBody } = req.body;
  let options = { percentage: 66, jpegOptions: { force: true, quality: 33 } };
  const ThumbFile = await imageThumbnail(req.file.buffer, options);

  const body = { File: req.file.buffer, ThumbFile, ...restBody }

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

  let options = { percentage: 30 }
  const ThumbFile = await imageThumbnail(req.file.buffer, options);

  const body = { File: req.file.buffer, ThumbFile, ...restBody }

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



// ADD NEW PERSON PHOTO
router.post('/people/new', [authenticateToken, upload.single('file')], async (req, res) => {
  const db = req.app.get('db');

  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('create')) res.sendStatus(403);

  const { PersonID, ...restBody } = req.body;

  let options = { percentage: 30 }
  const ThumbFile = await imageThumbnail(req.file.buffer, options);

  const body = { File: req.file.buffer, ThumbFile, ...restBody }

  const response = await db.insert(body)
    .into('dbo.photo')
    .returning('*')
    .then(async rows => {
      const newPersonPhoto = rows[0];

      await db.insert({ PersonID, PhotoID: newPersonPhoto.RowId })
        .into('Person.Photo')
        .returning('*')
      .then(rows => {
        return rows;
      });

      return newPersonPhoto;
    });
  
  res.status(200).send({ message: 'Upload Success' });
});

module.exports = router