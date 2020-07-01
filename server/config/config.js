// Puerto http
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Connection string MongoDB

let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe-nodejs' : process.env.MONGO_URI;
process.env.URLDB = urlDB;

// Caducidad del token

process.env.TOKEN_EXPIRES = 60 * 60 * 24 * 30;

// Token key

process.env.TOKEN_KEY = process.env.TOKEN_KEY_PROD || 'token-key-desarrollo';