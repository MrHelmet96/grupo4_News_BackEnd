
// Importa la biblioteca 'mysql2' para interactuar con la base de datos MySQL.
const mysql = require('mysql2');
// Importa la configuración de la base de datos desde el archivo 'config.json'
const configuracion = require("../../backend/config.json");

// Crea una conexión a la base de datos utilizando la configuración definida en 'config.json'.
const connection = mysql.createConnection(configuracion.database);

// Establece la conexión a la base de datos y maneja errores si los hay.
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});

// Objeto 'roles_db' para gestionar las operaciones de la base de datos relacionadas con roles.
const roles_db = {};

// Función para obtener todos los roles de la base de datos.
roles_db.getAll = function (funCallback) {
    const consulta = 'SELECT * FROM roles';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al obtener los roles de la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// Función para actualizar un rol por su ID.
roles_db.update = function (datos, role_id, funCallback) {
    // Verificar si el role_id es de un rol predefinido (1, 2 o 3) y si lo es, no se permite modificarlo.
    if (role_id >= 1 && role_id <= 3) {
        funCallback({
            message: "No se permite la modificación de roles predefinidos",
            detail: null
        });
        return;
    }

    const consulta = "UPDATE roles SET role_name = ? WHERE role_id = ?";
    const params = [datos.role_name, role_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al actualizar el rol en la base de datos",
                detail: err
            });
        } else if (result.affectedRows === 0) {
            funCallback({
                message: "No se encontró un rol con el ID proporcionado",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se actualizó el rol con ID ${role_id}`,
                detail: result
            });
        }
    });
}

// Exporta el objeto 'roles_db' para su uso en otros archivos.
module.exports = roles_db;
