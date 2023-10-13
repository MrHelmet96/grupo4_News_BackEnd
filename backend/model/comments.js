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

// Objeto 'comments_db' para gestionar las operaciones de la base de datos relacionadas con comentarios.
const comments_db = {};

// Función para crear un nuevo comentario 
comments_db.create = function (datos, funCallback) {
    const consulta = "INSERT INTO comments (content, user_id, article_id, comment_date) VALUES (?, ?, ?, ?);";
    const params = [datos.content, datos.user_id, datos.article_id, datos.comment_date];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al insertar el comentario en la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, {
                message: "Se creó un nuevo comentario",
                detail: result
            });
        }
    });
}

// Función para obtener todos los comentarios
comments_db.getAll = function (funCallback) {
    const consulta = 'SELECT * FROM comments';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al obtener los comentarios de la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// Función para obtener un comentario por su ID.
comments_db.getById = function (comment_id, funCallback) {
    const consulta = 'SELECT * FROM comments WHERE comment_id = ?';
    connection.query(consulta, [comment_id], function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al obtener el comentario de la base de datos",
                detail: err
            });
        } else if (rows.length === 0) {
            funCallback(null); // No se encontró el comentario
        } else {
            funCallback(undefined, rows[0]);
        }
    });
}

// Función para eliminar un comentario por su ID.
comments_db.delete = function (comment_id, funCallback) {
    const consulta = "DELETE FROM comments WHERE comment_id = ?";
    connection.query(consulta, [comment_id], (err, result) => {
        if (err) {
            funCallback({
                message: "Error al eliminar el comentario de la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, {
                message: "Comentario eliminado",
                detail: result
            });
        }
    });
}

// Función para actualizar un comentario por su ID.
comments_db.update = function (datos, comment_id, funCallback) {
    const consulta = "UPDATE comments SET content = ?, user_id = ?, article_id = ?, comment_date = ? WHERE comment_id = ?";
    const params = [datos.content, datos.user_id, datos.article_id, datos.comment_date, comment_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al actualizar el comentario en la base de datos",
                detail: err
            });
        } else if (result.affectedRows === 0) {
            funCallback({
                message: "No se encontró un comentario con el ID proporcionado",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se actualizó el comentario con ID ${comment_id}`,
                detail: result
            });
        }
    });
}

// Exporta el objeto 'comments_db' para su uso en otros archivos.
module.exports = comments_db;
