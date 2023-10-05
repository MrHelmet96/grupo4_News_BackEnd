//configuraciones iniciales
require('rootpath')();

const mysql = require('mysql2');

const configuracion = require("config.json");

//inicializa la conexion entre el servidor y la base de datos
var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});

var user_db = {};
