const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.init();
    }

    async init() {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            console.log('Connexion MySQL réussie');
        } catch (error) {
            console.error(' Erreur de connexion MySQL:', error);
        }
    }

    getConnection() {
        return this.connection;
    }
}

module.exports = new Database();