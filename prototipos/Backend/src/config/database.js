const mariadb = require("mariadb");
const config = require("./config");

class Database {

    constructor() {
        this.pool = mariadb.createPool(config);
    }

    async getConnection() {
        try {
            const connection = await this.pool.getConnection();
            return connection;
        } catch(error) {
            throw error;
        }
    } 

}

module.exports = Database;
