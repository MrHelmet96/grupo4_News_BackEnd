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
        console.log("base de datos conectada a artículos");
    }
});

// Objeto 'articles_db' para gestionar las operaciones de la base de datos relacionadas con artículos.
const articles_db = {};


// Función para crear un nuevo artículo en la base de datos.
articles_db.create = function (datos, funCallback) {
    const consulta = "INSERT INTO articles (title, subtitle, content, user_id, category_id) VALUES (?, ?, ?, ?, ?);";
    const params = [datos.title, datos.subtitle,datos.content, datos.user_id, datos.category_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al insertar el artículo en la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, {
                message: "Se creó un nuevo artículo",
                detail: result
            });
        }
    });
}

// Función para obtener todos los artículos de la base de datos.
articles_db.getAll = function (funCallback) {
    const consulta = 'SELECT * FROM articles';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al obtener los artículos de la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// Función para obtener un artículo por su ID.
articles_db.getById = function (article_id, funCallback) {
    var consulta = 'SELECT * FROM articles WHERE article_id = ?';
    connection.query(consulta, [article_id], function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al obtener el artículo de la base de datos",
                detail: err
            });
        } else if (rows.length === 0) {
            funCallback(null); // No se encontró el artículo
        } else {
            funCallback(undefined, rows[0]);
        }
    });
}

// Función para eliminar un artículo por su ID.
articles_db.delete = function (article_id, funCallback) {
    const consulta = "DELETE FROM articles WHERE article_id = ?";
    connection.query(consulta, [article_id], (err, result) => {
        if (err) {
            funCallback({
                message: "Error al eliminar el artículo de la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, {
                message: "Artículo eliminado",
                detail: result
            });
        }
    });
}

// Función para actualizar un artículo por su ID.
articles_db.update = function (datos, article_id, funCallback) {
    const consulta = "UPDATE articles SET title = ?, subtitle = ?, content = ?, user_id = ?, category_id = ? WHERE article_id = ?";
    const params = [datos.title, datos.subtitle, datos.content, datos.user_id, datos.category_id, article_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al actualizar el artículo en la base de datos",
                detail: err
            });
        } else if (result.affectedRows === 0) {
            funCallback({
                message: "No se encontró un artículo con el ID proporcionado",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se actualizó el artículo con ID ${article_id}`,
                detail: result
            });
        }
    });
}

// Exporta el objeto 'articles_db' para su uso en otros archivos.
module.exports = articles_db;
