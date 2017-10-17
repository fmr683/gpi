
var config = {
    sessionSecret: '',
    pgDb: 'pickme',
    pgUsername: 'nouffer',
    pgPassword: 'simple',
    pgHost: '104.197.167.5',
    pgPort: 5432,
    nodePort: 3000,
    jwtSecretKey: 'gisportal'
};

const { Pool } = require('pg')
// https://node-postgres.com/api/pool
pgConfig = {
    user: config.pgUsername,
    host: config.pgHost,
    database:  config.pgDb,
    password: config.pgPassword,
    port: config.pgPort,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
}

const pool = new Pool(pgConfig)


module.exports = pool;