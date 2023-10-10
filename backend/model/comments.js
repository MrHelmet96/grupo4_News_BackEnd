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


const comments_db = {};

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

module.exports = comments_db;
