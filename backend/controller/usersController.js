// Importa el módulo 'rootpath' para resolver rutas de manera más sencilla.
require('rootpath')();

// Importa la biblioteca 'express' para gestionar y lanzar servidores web.
const express = require('express');
const app = express();

// Middleware para analizar solicitudes en formato JSON y datos de formulario.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Importa el módulo 'persons_db' que contiene las funciones relacionadas con los usuarios.
var users_db = require("../model/users.js")

// Definición de rutas de escucha (endpoints) disponibles para usuarios.
app.post('/', crear);
app.get('/', getAll);
app.delete('/:user_id', borrar);

//función para manejar la solicitud POST
function crear(req, res) {
    let users = req.body;
    users_db.create(users, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

// Función para manejar la solicitud GET
function getAll(req, res) {
    users_db.getAll(function (err, resultado) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

//función para manejar la solicitud DELETE
function borrar(req, res) {
    let id_usuario_a_eliminar = req.params.user_id;
    users_db.borrar(id_usuario_a_eliminar, (err, result_model) => {
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

// Exporta la aplicación 'app' para que pueda ser utilizada en otros archivos.
module.exports = app;