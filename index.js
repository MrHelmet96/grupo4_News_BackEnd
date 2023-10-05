// Importa el módulo 'rootpath' para resolver rutas de manera más sencilla.
require('rootpath')();

// Importa las bibliotecas necesarias
const express = require('express')
const app = express()
const morgan = require('morgan');


// Importa el módulo 'cors' para permitir solicitudes cruzadas entre dominios.
var cors = require('cors')
app.use(cors())

// Configura Express para analizar JSON y datos de formulario.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utiliza el middleware 'morgan' para registrar solicitudes HTTP.
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

// Importa la configuración desde el archivo 'config.json' para levantar el servidor.
 const configuracion = require("./backend/config.json");


 // Importa el controlador de personas.
const personsController = require("./backend/controller/personsController.js");

// Define una ruta '/persons' y asigna el controlador 'personsController' a ella.
app.use('/persons', personsController);


// Inicia el servidor en el puerto 8080 y maneja posibles errores.
app.listen(8080, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("sevidor escuchando en el puerto " + configuracion.server.port );
    }
});
































