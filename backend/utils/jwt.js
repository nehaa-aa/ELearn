
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'devsecret';

function sign(user){ return jwt.sign({sub: user._id, role: user.role}, SECRET, {expiresIn:'8h'}); }

function verify(token){
  try { return jwt.verify(token, SECRET); } catch(e){ return null; }
}

module.exports = { sign, verify };
