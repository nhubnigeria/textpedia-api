'use strict';
/**
 * Module dependencies
 */
//=============================================================================
const
  os = require('os'),
  nodemailer = require('nodemailer'),
  sgTransport = require('nodemailer-sendgrid-transport'),
  messaging_send = require('./messaging_send');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const
  testEmail = 'oakinogundeji@gmail.com',
  sgtOptions = {
    auth: {
        api_user: process.env.SendGridUsername,
        api_key: process.env.SendGridPassword
      }
    },
  mailer = nodemailer.createTransport(sgTransport(sgtOptions));
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = function (token, email, JWT, res) {
  const msg = {
    to: email,
    from: 'register@textpedia.com',
    subject: 'Your auth token',
    text: 'Hi, ' + os.EOL + os.EOL +'Thanks for siging up for the Textpedia service, your' +
      ' auth token is:' + os.EOL + os.EOL + token + os.EOL + os.EOL + '' +
      ' Please return to the confirmation page and input this token.' +
      ' The token is valid for 5 minutes. Thank you for signing up for our service.' +
      os.EOL + os.EOL + ' The Textpedia Team.'
  };
  //send email
  mailer.sendMail(msg, function(err, resp) {
    if(err) {
      console.log('There was an error sending the token to the user\'s email');
      console.error(err);
      return res.status(500).json('There was an error sending the token to the user\'s email');
    }
    else {
      console.log(resp);
      return res.status(200).json({
        msg: 'Creds saved!',
        jwt: JWT
      });
    }
  });
};
//=============================================================================
