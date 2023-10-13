// Importa el módulo Express y crea una instancia de la aplicación.
const express = require('express');
const app = express();

// Configura el middleware para el manejo de datos JSON y datos codificados en URL.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importa el módulo de base de datos para las categorías.
const categories_db = require('../model/categories');

// Rutas y funciones para gestionar las categorías.
app.post('/', crearCategoria);
app.get('/', getAllCategorias);
app.get('/:category_id', getCategoriaPorId);
app.delete('/:category_id', borrarCategoria);
app.put('/:category_id', actualizarCategoria);

// Ruta POST para crear una nueva categoría.
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

// Ruta GET para obtener todas las categorías.
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

// Ruta GET para obtener una categoría por su ID.
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

// Ruta DELETE para eliminar una categoría por su ID.
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

// Ruta PUT para actualizar una categoría por su ID.
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

// Exporta la aplicación para su uso en otros archivos.
module.exports = app;
