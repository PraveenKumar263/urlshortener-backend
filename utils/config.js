require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;
const JWT_TOKEN = process.env.JWT_TOKEN;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PWD = process.env.EMAIL_PWD;
const FRONTEND_URL = process.env.FRONTEND_URL;
const SMTP_EMAIL_HOST = process.env.SMTP_EMAIL_HOST || 'gmail';
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_TOKEN,
    SALT_ROUNDS,
    EMAIL_ID,
    EMAIL_PWD,
    FRONTEND_URL,
    SMTP_EMAIL_HOST,
    SECRET_KEY
};