//import the squelize constructor from the library
const Sequelize = require('sequelize');
require('dotenv').config();

//create connection to the database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialiect: 'mysql',
    port: 3306
});

module.exports = sequelize;