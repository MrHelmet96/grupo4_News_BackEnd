const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const categories_db = require('../model/categories');

app.post('/', crearCategoria);
app.get('/', getAllCategorias);
app.get('/:category_id', getCategoriaPorId);
app.delete('/:category_id', borrarCategoria);
app.put('/:category_id', actualizarCategoria);

function crearCategoria(req, res) {
    const nuevaCategoria = {
        category_name: req.body.category_name
    };

    categories_db.create(nuevaCategoria, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al crear la categoría',
                detail: error
            });
        } else {
            res.status(201).json({
                message: 'Categoría creada con éxito',
                detail: resultado
            });
        }
    });
}

function getAllCategorias(req, res) {
    categories_db.getAll((error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener las categorías',
                detail: error
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

function getCategoriaPorId(req, res) {
    const category_id = req.params.category_id;

    categories_db.getById(category_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener la categoría',
                detail: error
            });
        } else if (!resultado) {
            res.status(404).json({
                error: true,
                message: 'No se encontró una categoría con el ID proporcionado'
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

function borrarCategoria(req, res) {
    const category_id = req.params.category_id;

    categories_db.delete(category_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al eliminar la categoría',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró una categoría con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Categoría eliminada con éxito',
                detail: resultado
            });
        }
    });
}

function actualizarCategoria(req, res) {
    const category_id = req.params.category_id;
    const datosActualizados = {
        category_name: req.body.category_name
    };

    categories_db.update(datosActualizados, category_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al actualizar la categoría',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró una categoría con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Categoría actualizada con éxito',
                detail: resultado
            });
        }
    });
}

module.exports = app;
