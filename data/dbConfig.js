const knex = require('knex');
const knexConfig = require('../knexfile.js');
const dbENV = process.env.DB_ENV || 'developent';

module.exports = knex(knexConfig[dbENV]);
