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


const articles_db = {};

articles_db.create = function (datos, funCallback) {
    const consulta = "INSERT INTO articles (title, publication_date, content, user_id, category_id) VALUES (?, ?, ?, ?, ?);";
    const params = [datos.title, datos.publication_date, datos.content, datos.user_id, datos.category_id];

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

articles_db.getById = function (article_id, funCallback) {
    const consulta = 'SELECT * FROM articles WHERE article_id = ?';
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

articles_db.update = function (datos, article_id, funCallback) {
    const consulta = "UPDATE articles SET title = ?, publication_date = ?, content = ?, user_id = ?, category_id = ? WHERE article_id = ?";
    const params = [datos.title, datos.publication_date, datos.content, datos.user_id, datos.category_id, article_id];

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

module.exports = articles_db;
