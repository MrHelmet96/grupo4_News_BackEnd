// Importa el módulo 'rootpath' para resolver rutas de manera más sencilla.
require('rootpath')();

// Importa la biblioteca 'express' para gestionar y lanzar servidores web.
const express = require('express');
const app = express();

// Middleware para analizar solicitudes en formato JSON y datos de formulario.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Importa el módulo 'users_db' que contiene las funciones relacionadas con los usuarios.
var users_db = require("../model/users.js")

// Importa el módulo 'securityController' que contiene funciones para verificar tokens.
const securityController = require("./securityController");

// Definición de rutas de escucha (endpoints) disponibles para usuarios.

app.get('/', securityController.verificarToken, getAll);
app.post('/', createUser);
app.put('/:user_id', updateUser);
app.delete('/:user_id', borrar);


// Función para obtener todos los usuarios.
function getAll(req, res) {
    users_db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

// Función para crear un nuevo usuario.
function createUser(req, res) {
    let user = req.body;
    console.log(user)
    users_db.create(user, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

// Función para actualizar un usuario por su ID.
function updateUser(req, res) {
    const id_usuario_actualizar = req.params.user_id;
    const user = req.body;

    users_db.update(id_usuario_actualizar, user, (err, result_model) => {
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



//función para manejar la solicitud DELETE y eliminar un usuario.
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