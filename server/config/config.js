// Puerto http
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Connection string MongoDB

let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe-nodejs' : process.env.MONGO_URI;
process.env.URLDB = urlDB;

// Caducidad del token

process.env.TOKEN_EXPIRES = '48h';

// Token key

process.env.TOKEN_KEY = process.env.TOKEN_KEY_PROD || 'token-key-desarrollo';

// Google Auth
process.env.CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE || '282135740556-gfctbv1hmhghv8cds0pp6kej03a57gv3.apps.googleusercontent.com';