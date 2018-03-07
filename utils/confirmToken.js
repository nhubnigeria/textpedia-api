/**
 * Module dependencies
 */
//=============================================================================
const sendNumber = require('./sendNumber');
var User = require('../models/users');
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = function (token, p_num, res) {
  User.findOne({phoneNumber: p_num}, function (err, user) {
    if(err) {
      console.log('There was a dB access error in retrieving the user');
      console.error(err);
      return res.status(500).json('There was an error retrieving the user\'s details');
    }
    const USR_TOKEN = user.temp_token.value;
    if(token == USR_TOKEN) {
      user.active = true;
      user.temp_token.value = '';
      sendNumber(user.email, process.env.TWILIOLivePhoneNumber);
      return res.status(200).json('Your account has been verified!');
    }
    else {
      return res.status(403).json('There was a problem confirming the token. Please retry in 2 hours.');
    }
  });
};
//=============================================================================
