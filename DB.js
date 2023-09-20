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

    static getPerfilByUser = async (name) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().input("pname", sql.NVarChar, name).query("SELECT perfil.* FROM [perfil] INNER JOIN [user] ON [user].name = @pname WHERE fkUsuario = 1");
            return result.recordset[0];
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static insertPerfil = async (username, perfil) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().input("pname", sql.NVarChar, username).input("ppelo", perfil.colorDePelo).input("pamigos", perfil.cantAmigos).query("INSERT INTO [perfil](fkUsuario, colorDePelo, cantAmigos) VALUES((SELECT id FROM [user] WHERE name = @pname), @ppelo, @pamigos)");
            return result.rowsaffected;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

export default DB;