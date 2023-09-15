const mariadb = require("mariadb");
const pool = mariadb.createPool({
    connectionLimit : 10,
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'prosify',
    debug    :  false
});

module.exports = {
    getConnection() {
        return new Promise(function (res, rej) {
            pool.getConnection()
            .then(function (conn) {
                res(conn);
            })
            .catch(function (error) {
                rej(error);
            });
        });
    }
};
