const nodemailer = require('nodemailer');
const { EMAIL_ID, EMAIL_PWD, SMTP_EMAIL_HOST } = require('./config');

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: SMTP_EMAIL_HOST,
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_PWD,
  },
});

module.exports = transporter;
