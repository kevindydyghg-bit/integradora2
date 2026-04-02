const mysql = require('mysql2');

// Creamos la conexión a tu MySQL local en Laragon
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Por defecto en Laragon el usuario es root
    password: '', // Por defecto en Laragon no hay contraseña
    database: 'prueba_edu',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Usamos promesas para poder usar async/await en nuestro servidor
module.exports = pool.promise();