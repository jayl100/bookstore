const mariadb = require('mysql2');

const connection = mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'bookStore',
    dateStrings: true
});

module.exports = connection;