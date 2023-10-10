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


const categories_db = {};

categories_db.create = function (datos, funCallback) {
    const consulta = "INSERT INTO categories (category_name) VALUES (?);";
    const params = [datos.category_name];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al insertar la categoría en la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, {
                message: "Se creó una nueva categoría",
                detail: result
            });
        }
    });
}

categories_db.getAll = function (funCallback) {
    const consulta = 'SELECT * FROM categories';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al obtener las categorías de la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

categories_db.getById = function (category_id, funCallback) {
    const consulta = 'SELECT * FROM categories WHERE category_id = ?';
    connection.query(consulta, [category_id], function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al obtener la categoría de la base de datos",
                detail: err
            });
        } else if (rows.length === 0) {
            funCallback(null); // No se encontró la categoría
        } else {
            funCallback(undefined, rows[0]);
        }
    });
}

categories_db.delete = function (category_id, funCallback) {
    const consulta = "DELETE FROM categories WHERE category_id = ?";
    connection.query(consulta, [category_id], (err, result) => {
        if (err) {
            funCallback({
                message: "Error al eliminar la categoría de la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, {
                message: "Categoría eliminada",
                detail: result
            });
        }
    });
}

categories_db.update = function (datos, category_id, funCallback) {
    const consulta = "UPDATE categories SET category_name = ? WHERE category_id = ?";
    const params = [datos.category_name, category_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al actualizar la categoría en la base de datos",
                detail: err
            });
        } else if (result.affectedRows === 0) {
            funCallback({
                message: "No se encontró una categoría con el ID proporcionado",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se actualizó la categoría con ID ${category_id}`,
                detail: result
            });
        }
    });
}

module.exports = categories_db;
