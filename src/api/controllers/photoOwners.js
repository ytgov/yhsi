var express = require('express');
var router = express.Router();
var authenticateToken = require('../middlewares');
// const cors = require('cors')// 
// router.use(cors());
// router.all('*', cors());
router.get('/', authenticateToken, async (req, res) => {
  const permissions = req.decodedToken['yg-claims'].permissions;
  if (!permissions.includes('view')) res.sendStatus(403);

  const db = req.app.get('db');
  const { page = 0, limit = 10, textToMatch = '', sortBy = 'Name', sort = 'asc' } = req.query;
  const offset = (page*limit) || 0;
  let counter = 0;
  let owners = [];

  if (textToMatch) {

    owners = await db.select('*')
      .from('dbo.PhotoOwner')
      .orderBy(`${sortBy}`,`${sort}`)
      .where('dbo.PhotoOwner.Name', 'like', `%${textToMatch}%`)
      .limit(limit).offset(offset);
      
  } else {
    owners = await db.select('*')
      .from('dbo.PhotoOwner')
      .orderBy(`${sortBy}`,`${sort}`)
      .limit(limit).offset(offset);
  }

    res.status(200).send({ body: owners  });
});

module.exports = router;