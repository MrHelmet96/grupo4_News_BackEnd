// Importa el módulo 'rootpath' para configuraciones iniciales.
require('rootpath')();

// Importa los módulos 'mysql2' y 'bcrypt' para la gestión de base de datos y contraseñas.
const mysql = require('mysql2');
const bcrypt = require('bcrypt');


// Importa la configuración del archivo 'config.json'.
const configuracion = require("../../backend/config.json")

//inicializa la conexion entre el servidor y la base de datos
var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada a usuarios");
    }
});

var users_db = {};



// Función create para registrar nuevos usuarios.
users_db.create = function (users, funcallback) {
// Cifra la contraseña del usuario.
    let claveCifrada = bcrypt.hashSync(users.clave, 10);
// Define la consulta SQL para insertar un nuevo usuario
    consulta = "INSERT INTO users (name,surname,email,password,rol_id) VALUES (?,?,?,?,?);";
// Define los parámetros que se deben insertar en la consulta.
    params = [users.name,users.surname,users.email, claveCifrada,1, users.persons]; 
 // Ejecuta la consulta en la base de datos.
    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {
// Si se produce un error, verifica si es un error de duplicado (correo electrónico duplicado).
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
// Si no hay errores, se registra el nuevo usuario en la base de datos.
            funcallback(undefined, {
                message: "su usuario para ingresar es " + users.email,
                detalle: detail_bd
            });
        }
    });
}

// Función para buscar un usuario por su dirección de correo electrónico.
users_db.findByEmail = function (mail, funCallback) {
    var consulta = 'SELECT * FROM users WHERE email = ?';

    connection.query(consulta, mail, function (err, result) { // En caso de error en la consulta.
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

users_db.findByID = function (id, funCallback) {
    // Parsea el user_id como número
    id = parseInt(id, 10);
    console.log(id)

    const consulta = 'SELECT * FROM users WHERE user_id = ?';

    connection.query(consulta, [id], function (err, result) {
        if (err) {
            return funCallback(err);
        }

        

        if (result.length > 0) {
            return funCallback(null, result[0]); // Devuelve el primer resultado. 
        }


        return funCallback({
            message: "No existe un usuario que coincida con el criterio de búsqueda",
            detail: result
        });
    });
};


// Función getAll
users_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM users';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "ha ocurrido un error inesperado al buscar los usuarios",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}


// Función para actualizar un usuario por su ID.
users_db.update = function (user_id, updatedUser, funCallback) {
    const claveCifrada = bcrypt.hashSync(updatedUser.password, 10);
    const consulta = "UPDATE users SET email = ?, password = ?, person_id = ?, rol_id = ? WHERE user_id = ?";
    const params = [updatedUser.email, claveCifrada, updatedUser.person_id, updatedUser.rol_id, user_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({ message: err.code, detail: err }); // En caso de error en la actualización.
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined, {
                    message: "No se encontró un usuario con el ID proporcionado",
                    detail: result
                });
            } else {
                funCallback(undefined, { message: "Usuario actualizado", detail: result });
            }
        }
    });
}



// Función para eliminar un usuario por su ID.
users_db.borrar = function (user_id, funCallback) {
    consulta = "DELETE FROM users WHERE user_id = ?";
    connection.query(consulta, user_id, (err, result) => {
        if (err) {
            funCallback({ menssage: err.code, detail: err }); // En caso de error en la eliminación.
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: "no se encontro unusuario con el id ingresado",
                        detail: result
                    });
            } else {
                funCallback(undefined, { message: "usuario eliminado", detail: result }); // Si se elimina con éxito.
            }
        }
    });
}


// Exporta el objeto 'users_db' para que pueda ser utilizado en otros archivos.
module.exports = users_db