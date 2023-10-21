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
        console.log("base de datos conectada a categorias");
    }
});

// Objeto 'categories_db' para gestionar las operaciones de la base de datos relacionadas con categorías.
const categories_db = {};

// Función para crear una nueva categoría.
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

// Función para obtener todas las categorías.
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

// Función para obtener una categoría por su ID.
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

// Función para eliminar una categoría por su ID.
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

// Función para actualizar una categoría por su ID.
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

// Exporta el objeto 'categories_db' para su uso en otros archivos.
module.exports = categories_db;
