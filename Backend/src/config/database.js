const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,

    driver: 'ODBC Driver 18 for SQL Server',

    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const poolPromise = sql.connect(config);

module.exports = {
    sql,
    poolPromise
};