//configuraciones iniciales
require('rootpath')();

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const configuracion = require("../../backend/config.json")

//inicializa la conexion entre el servidor y la base de datos
var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});

var users_db = {};



//Función create (incompleta por el momento, sigo trabajando en el login - security)
users_db.create = function (users, funcallback) {
    
    let claveCifrada = bcrypt.hashSync(users.password, 10);
console.log(claveCifrada) //agregamos este console
    consulta = "INSERT INTO users (user_id,email, password, person_id, rol_id) VALUES (?,?,?,?,?);";
    params = [users.email, claveCifrada,users.password, users.person_id, users.rol_id]; //cambiamos persons por person_id
    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    message: "el usuario ya fue registrado",
                    detalle: err
                });
            } else {
                funcallback({
                    message: "error diferente",
                    detalle: err
                });
            }
        } else {

            funcallback(undefined, {
                message: "su usuario para ingresar es " + users.email,
                detalle: detail_bd
            });
        }
    });
}

//función de login 
users_db.findByEmail = function (email, funCallback) {
    var consulta = 'SELECT * FROM users WHERE email = ?';
    connection.query(consulta, email, function (err, result) {
        if (err) {
            funCallback(err);
            return;
        } else {

            if (result.length > 0) {
                funCallback(undefined, {
                    message: `Usuario encontrado`,
                    detail: result[0]
                });
            } else {
                funCallback({
                    message: "No existe un usuario que coincida con el criterio de busqueda",
                    detail: result
                });
            }
        }
    });
}



//función DELETE
users_db.borrar = function (user_id, funCallback) {
    consulta = "DELETE FROM users WHERE user_id = ?";
    connection.query(consulta, user_id, (err, result) => {
        if (err) {
            funCallback({ menssage: err.code, detail: err });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: "no se encontro unusuario con el id ingresado",
                        detail: result
                    });
            } else {
                funCallback(undefined, { message: "usuario eliminado", detail: result });
            }
        }
    });
}


// Exporta el objeto 'users_db' para que pueda ser utilizado en otros archivos.
module.exports = users_db