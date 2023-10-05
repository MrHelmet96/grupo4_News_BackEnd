//configuraciones iniciales
require('rootpath')();


// Importa la biblioteca 'mysql2' para interactuar con la base de datos MySQL.
const mysql = require('mysql2');

// Importa la configuración de la base de datos desde 'config.json'.
const configuracion = require("../../backend/config.json")

//inicializa la conexion entre el servidor y la base de datos
var connection = mysql.createConnection(configuracion.database);

// Establece la conexión a la base de datos y maneja errores si los hay.
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});

// Objeto 'persons_db' para definir funciones relacionadas con personas.
var persons_db = {};

// Función getAll
persons_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM persons';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "ha ocurrido un error inesperado al buscar la persona",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// Exporta el objeto 'persons_db' para que pueda ser utilizado en otros archivos.
module.exports = persons_db