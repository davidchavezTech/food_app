const mysql = require('mysql');
const { promisify } = require('util');
const { likes_db } = require('./keys');

//createPool es como createConnection pero mas forgiving
const likes_db_connection = mysql.createPool(likes_db);

likes_db_connection.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        };
    }
    if (connection) {

    connection.release();
    console.log('DB is connected');
}
    return;
})

//Promisify Pool Querys - Nos permite hacer promesas
likes_db_connection.query = promisify(likes_db_connection.query);
module.exports = likes_db_connection;