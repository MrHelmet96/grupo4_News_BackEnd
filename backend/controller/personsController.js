//Este controlador no lo utilizamos por modificaciones en el proyecto

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
app.post('/', crear);
app.get('/', getAll);
app.delete('/:person_id', borrar);
app.put('/:person_id', actualizar);

//función para manejar la solicitud POST
function crear(req, res) {
    let persons = req.body;
    persons_db.create(persons, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}


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

//función para manejar la solicitud DELETE
function borrar(req, res) {
    let id_persona_a_eliminar = req.params.person_id;
    persons_db.borrar(id_persona_a_eliminar, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);
            } else {
                res.send(result_model.message);
            }
        }
    });
}


//función para manejar la solicitud PUT
function actualizar(req, res) {
    let persons = req.body;
    let person_id = req.params.person_id;
    persons_db.update(persons,person_id , (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

// Exporta la aplicación 'app' para que pueda ser utilizada en otros archivos.
module.exports = app;