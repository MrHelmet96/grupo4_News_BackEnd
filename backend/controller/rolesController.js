const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const roles_db = require('../model/roles');

app.get('/', getAllRoles);
app.put('/:role_id', actualizarRol);

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

module.exports = app;
