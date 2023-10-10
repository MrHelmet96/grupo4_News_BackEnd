const mysql = require('mysql2');
const configuracion = require("../../backend/config.json");

const connection = mysql.createConnection(configuracion.database);

// Establece la conexión a la base de datos y maneja errores si los hay.
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});


const roles_db = {};

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

roles_db.update = function (datos, role_id, funCallback) {
    // Verificar si el role_id es de un rol predefinido (1, 2 o 3)
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

module.exports = roles_db;
