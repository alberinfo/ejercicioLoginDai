const config = require('./dbconfig.js');
const sql = require('mssql');

class DB {
    constructor() {
        this.pool = await sql.connect(config);
    }

    static getUser = async (name) => {
        
    }

    static insertUser = async (user) => {

    }
}