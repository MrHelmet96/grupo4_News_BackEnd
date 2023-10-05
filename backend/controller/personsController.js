// Importa el módulo 'rootpath' para resolver rutas de manera más sencilla.
require('rootpath')();

// Importa la biblioteca 'express' para gestionar y lanzar servidores web.
const express = require('express');
const app = express();

// Middleware para analizar solicitudes en formato JSON y datos de formulario.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importa el módulo 'persons_db' que contiene las funciones relacionadas con las personas.
var persons_db = require("../model/persons.js")

// Definición de rutas de escucha (endpoints) disponibles para PERSONAS.
app.get('/', getAll);


// Función para manejar la solicitud GET
function getAll(req, res) {
    persons_db.getAll(function (err, resultado) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

// Exporta la aplicación 'app' para que pueda ser utilizada en otros archivos.
module.exports = app;