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
        console.log("base de datos conectada a personas");
    }
});

// Objeto 'persons_db' para definir funciones relacionadas con personas.
var persons_db = {};


//Función create
persons_db.create = function (datos, funCallback) {
    consulta = "INSERT INTO persons (name,surname,address,phone_number) VALUES (?,?,?,?);";
    params = [datos.name,datos.surname,datos.address,datos.phone_number];

    connection.query(consulta, params, (err, rows) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "La persona ya fue registrada anteriormente",
                    detail: err
                });
            } else {
                funCallback({
                    message: "error diferente",
                    detail: err
                });
            }
        } else {
            funCallback(undefined, {
                message: `se creo la persona  ${datos.name} `,
            });
        }
    });
}

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

//función DELETE
persons_db.borrar = function (person_id, funCallback) {
    consulta = "DELETE FROM persons WHERE person_id = ?";
    connection.query(consulta, person_id, (err, result) => {
        if (err) {
            funCallback({ menssage: err.code, detail: err });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: "no se encontro una persona con el id ingresado",
                        detail: result
                    });
            } else {
                funCallback(undefined, { message: "persona eliminada", detail: result });
            }
        }
    });
}


//función put 
persons_db.update = function (datos,person_id, funCallback) {
    consulta = "UPDATE persons SET name = ?, surname = ?, address = ?, phone_number = ? WHERE person_id = ?";
    params = [ datos.name, datos.surname,datos.address,datos.phone_number, person_id];

    connection.query(consulta, params, (err, result) => {

        if (err) {
            if (err.code == "ER_DUP_ENTRY") { //id duplicado
                funCallback({
                    message: "Los datos a insertar generan una persona duplicada",
                    detail: err
                });
            } else { //algun otro codigo de error
                funCallback({
                    message: "error diferente, analizar codigo error",
                    detail: err
                });
            }
        } else if (result.affectedRows == 0) { //persona a actualizar no encontrada
            funCallback({
                message: "No existe persona que coincida con el criterio de busqueda",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `se modificó la persona  ${datos.name}`,
                detail: result
            });
        }
    });
}


// Exporta el objeto 'persons_db' para que pueda ser utilizado en otros archivos.
module.exports = persons_db