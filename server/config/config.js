// Puerto http
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Connection string MongoDB

let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe-nodejs' : process.env.MONGO_URI;
process.env.URLDB = urlDB;