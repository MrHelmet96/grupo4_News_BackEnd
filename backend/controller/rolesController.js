// Importa el módulo Express y crea una instancia de la aplicación.
const express = require('express');
const app = express();

// Configura middleware para el manejo de datos JSON y URL codificados.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importa el módulo de base de datos para los roles.
const roles_db = require('../model/roles');

// Rutas y funciones para gestionar los roles.
app.get('/', getAllRoles);
app.put('/:role_id', actualizarRol);

// Ruta GET para obtener todos los roles.
function getAllRoles(req, res) {
    roles_db.getAll((error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener los roles',
                detail: error
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

// Ruta PUT para actualizar un rol por su ID.
function actualizarRol(req, res) {
    const role_id = req.params.role_id;
    const datosActualizados = {
        role_name: req.body.role_name
    };

    roles_db.update(datosActualizados, role_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: error.message,
                detail: error.detail
            });
        } else {
            res.status(200).json({
                message: 'Rol actualizado con éxito',
                detail: resultado
            });
        }
    });
}

// Exporta la aplicación para su uso en otros archivos.
module.exports = app;
