// Este modelo es para utilizar en la próxima etapa del proyecto:

//configuraciones iniciales
require('rootpath')();
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
        console.log("base de datos conectada a imagenes");
    }
});


// Objeto 'images_db' para definir funciones relacionadas con las imágenes.
const images_db = {};

// Función create para insertar una nueva imagen.
images_db.create = function (datos, funCallback) {
    const consulta = "INSERT INTO images (url, article_id) VALUES (?, ?);";
    const params = [datos.url, datos.article_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al insertar la imagen en la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, {
                message: "Se creó una nueva imagen",
                detail: result
            });
        }
    });
}

// Función getAll para obtener todas las imágenes.
images_db.getAll = function (funCallback) {
    const consulta = 'SELECT * FROM images';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Error al buscar las imágenes en la base de datos",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// Función delete para eliminar una imagen por su ID.
images_db.delete = function (image_id, funCallback) {
    const consulta = "DELETE FROM images WHERE image_id = ?";
    connection.query(consulta, image_id, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al eliminar la imagen de la base de datos",
                detail: err
            });
        } else if (result.affectedRows === 0) {
            funCallback({
                message: "No se encontró una imagen con el ID proporcionado",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: "Imagen eliminada",
                detail: result
            });
        }
    });
}

// Función update para actualizar una imagen por su ID.
images_db.update = function (datos, image_id, funCallback) {
    const consulta = "UPDATE images SET url = ?, article_id = ? WHERE image_id = ?";
    const params = [datos.url, datos.article_id, image_id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Error al actualizar la imagen en la base de datos",
                detail: err
            });
        } else if (result.affectedRows === 0) {
            funCallback({
                message: "No se encontró una imagen con el ID proporcionado",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se actualizó la imagen con ID ${image_id}`,
                detail: result
            });
        }
    });
}

// Exporta el objeto 'images_db' para que pueda ser utilizado en otros archivos.
module.exports = images_db;
