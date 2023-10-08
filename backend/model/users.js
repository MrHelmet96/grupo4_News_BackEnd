//configuraciones iniciales
require('rootpath')();

const mysql = require('mysql2');

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
users_db.create = function (datos, funCallback) {
  consulta = "INSERT INTO users (email,password) VALUES (?,?);";
    params = [datos.email,datos.password];

    connection.query(consulta, params, (err) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "El usuario ya fue registrado anteriormente",
                    detail: err
                });
            } else {
                funCallback({
                    message: "error diferente",
                    detail: err
                });
            }
        } else {
            funCallback(undefined, {
                message: `se creo el usuario  ${datos.name} `,
            });
        }
    });
}

// Función getAll
users_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM users';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "ha ocurrido un error inesperado al buscar el usuario",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
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