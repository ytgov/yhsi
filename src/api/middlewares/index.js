
var jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, body) => {  
      if (err) return res.status(403).send('Invalid Token');
      req.decodedToken = body
  
      next();
    })
  }

module.exports = authenticateToken;