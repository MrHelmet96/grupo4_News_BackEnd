//en contrucción

require('rootpath')();

const mysql = require('mysql2');
const configuracion = require("../../backend/config.json");

var connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos conectada");
    }
});

var roles_db = {};

roles_db.create = function (roleName, funCallback) {
    consulta = "INSERT INTO roles (role_name) VALUES (?);";
    params = [roleName];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "El rol ya fue registrado anteriormente",
                    detail: err
                });
            } else {
                funCallback({
                    message: "Error diferente",
                    detail: err
                });
            }
        } else {
            funCallback(undefined, {
                message: `Se creó el rol ${roleName}`,
                roleId: result.insertId
            });
        }
    });
}

module.exports = roles_db;
