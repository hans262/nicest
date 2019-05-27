"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const mysql_2 = require("../conf/mysql");
exports.POOL = mysql_1.createPool({
    connectionLimit: mysql_2.CONNECTION_LIMIT,
    host: mysql_2.HOST,
    port: mysql_2.PORT,
    user: mysql_2.USER,
    password: mysql_2.PASSWORD,
    database: mysql_2.DATABASE,
});
function QUERY(sql) {
    return new Promise((resolve, reject) => {
        exports.POOL.getConnection((err, connection) => {
            if (err)
                return reject(err);
            connection.query(sql, (err, results) => {
                //释放连接
                connection.release();
                err ? reject(err) : resolve(results);
            });
        });
    });
}
exports.QUERY = QUERY;
/*
    ;(async(){
        const { QUERY }=require('./sql')
        try{
            const result=await QUERY("SELECT * FROM user")
            console.log(result)
        }catch(err){
            console.log(err)
        }
    })()
*/ 
//# sourceMappingURL=sql.js.map