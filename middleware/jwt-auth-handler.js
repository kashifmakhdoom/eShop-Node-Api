const expressJwt = require('express-jwt')

function authJwt() {
  const secret = process.env.SECRET_KEY;
  const apiUrl = process.env.API_BASE_URL;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, method: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, method: ['GET', 'OPTIONS'] },
      `${apiUrl}/users/login`,
      `${apiUrl}/users/register`
    ]
  })
}

async function isRevoked(req, payload, done) {
  if(!payload.isAdmin) {
    return done()
  } 
  return done();
}

module.exports = authJwt;