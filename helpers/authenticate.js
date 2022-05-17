const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_APP_CLIENT_ID,
};

const poolRegion = 'us-east-1';

const authenticate = async (req, res, next) => {
  if (req.url === '/user/login') {
    next();
  } else {
    const token = req.header('Authorization');
    request({
      url: `https://cognito-idp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
      json: true,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const pems = {};
        const { keys } = body;
        for (let i = 0; i < keys.length; i += 1) {
        // Convert each key to PEM
          const keyId = keys[i].kid;
          const modulus = keys[i].n;
          const exponent = keys[i].e;
          const keyType = keys[i].kty;
          const jwk = { kty: keyType, n: modulus, e: exponent };
          const pem = jwkToPem(jwk);
          pems[keyId] = pem;
        }
        // validate the token
        const decodedJwt = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
          res.status(401).json({ message: 'Not a valid JWT token' });
          return;
        }

        const { kid } = decodedJwt.header;
        const pem = pems[kid];
        if (!pem) {
          res.status(401).json({ message: 'Invalid Token' });
          return;
        }

        jwt.verify(token, pem, (err, payload) => {
          if (err) {
            res.status(401).json({ message: 'Invalid Token' });
          } else {
            req.loginUserId = payload.sub;
            req.loginUserEmail = payload.email;
            next();
          }
        });
      } else {
        res.status(401).json({ message: 'Error! Unable to download JWKs' });
      }
    });
  }
};

module.exports = authenticate;
