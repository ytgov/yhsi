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
  
  module.exports = router