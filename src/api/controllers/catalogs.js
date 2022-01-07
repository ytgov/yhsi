var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');
var multer = require('multer');

router.get('/community', authenticateToken, async (req, res) => {
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db');
  
    const community = await db.select('*')
      .from('Community').orderBy('Community.id', 'asc');
  
    res.status(200).send(community);
  });
  
  router.get('/originalmedia', authenticateToken, async (req, res) => {
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db');
  
    const media = await db.select('*')
      .from('OriginalMedia').orderBy('OriginalMedia.id', 'asc');
  
    res.status(200).send(media);
  });

  router.get('/vesseltype', authenticateToken, async (req, res) => {
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db');
  
    const { page = 0, limit = 10, textToMatch = '', sortBy = 'Id', sort = 'asc' } = req.query;
    const offset = (page*limit) || 0;
    let counter = 0;

    let types = [];

      if (textToMatch) {
        counter = await db.from('Boat.Type')
        .where('Boat.Type.Type', 'like', `%${textToMatch}%`)
        .count('Id', {as: 'count'});
    
        types = await db.from('Boat.Type')
        .where('Boat.Type.Type', 'like', `%${textToMatch}%`)
        .orderBy(`${sortBy}`,`${sort}`)
        .limit(limit).offset(offset);
    
      } else {
        counter = await db.from('Boat.Type').count('Id', {as: 'count'});
        
        types =  await db.select('*')
        .from('Boat.Type').orderBy(`${sortBy}`,`${sort}`)
        .limit(limit).offset(offset);;
    
      }
    
      res.status(200).send({ count: counter[0].count, body: types });
  });
  

  router.put('/vesseltype/:vesselId', authenticateToken, async (req, res) => {
    const db = req.app.get('db');
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('edit')) res.sendStatus(403);
  
    const { vesselId } = req.params;
  
  
    const { vesselType = {} } = req.body;

  
    await db('boat.Type')
        .update(vesselType)
        .where('boat.Type.Id', vesselId);

  
    res.status(200).send({ message: 'success' });
  });


  router.post('/vesseltype/new', authenticateToken, async (req, res) => {
    const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403);
  
    const { vesselType = {} } = req.body;
    
    const response = await db.insert(vesselType)
      .into('boat.Type')
      .returning('*');
  
    res.status(200).send(response);
  });
  
  router.get('/sites', authenticateToken, async (req, res) => {
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db');
  
    const { page = 0, limit = 10, textToMatch = '', sortBy = 'Name', sort = 'asc' } = req.query;
    const offset = (page*limit) || 0;

    let sites = [];

      if (textToMatch) {
    
        sites = await db.select('*')
        .from('Place.Place')
        .where('Place.Place.Name', 'like', `%${textToMatch}%`)
        .orderBy(`${sortBy}`,`${sort}`)
        .limit(limit).offset(offset);
    
      } else {
        
        sites =  await db.select('*')
        .from('Boat.Place')
        .orderBy(`${sortBy}`,`${sort}`)
        .limit(limit).offset(offset);;
    
      }
    
      res.status(200).send({ body: sites });
  });
  module.exports = router