import 'dotenv/config'

const config = {
    user : process.env.SqlUser,
    password : process.env.SqlPwd, 
    server : process.env.SqlSv, 
    database : process.env.SqlDb,
    options : {
        trustServerCertificate : true,
        trsutedConnection : true
    }
}

export default config;