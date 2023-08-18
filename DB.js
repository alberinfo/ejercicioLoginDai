import config from './dbconfig.js';
import sql from "mssql";

class DB {
    static getUser = async (name) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().input("pname", sql.NVarChar, name).query("SELECT * FROM [user] WHERE name = @pname");
            return result.recordset[0];
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static insertUser = async (user) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().input("pname", sql.NVarChar, user.name).input("ppwd", sql.NVarChar, user.pwd).query("INSERT INTO [user](name, pwd) VALUES(@pname, @ppwd)");
            return result.rowsaffected;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

export default DB;