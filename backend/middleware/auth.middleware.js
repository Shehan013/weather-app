const { auth } = require('express-oauth2-jwt-bearer');
const { User } = require('../models');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
});


const attachUser = async (req, res, next) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const email = req.auth.payload.email;

    let user = await User.findOne({ where: { auth0_id: auth0Id } });

    if (!user) {
      user = await User.create({
        auth0_id: auth0Id,
        email: email
      });
      console.log(`New user created: ${email}`);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in attachUser middleware:', error);
    res.status(500).json({ 
      success: false, 
      error: 'User authentication failed' 
    });
  }
};

module.exports = {
  checkJwt,
  attachUser
};