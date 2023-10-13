// Importa el módulo Express y crea una instancia de la aplicación.
const express = require('express');
const app = express();

// Configura el middleware para el manejo de datos JSON y datos codificados en URL.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Importa el módulo de base de datos para los artículos.
const articles_db = require('../model/articles');


// Definición de rutas y funciones para gestionar los artículos.
app.post('/', crearArticulo);
app.get('/', getAllArticulos);
app.get('/:article_id', getArticuloPorId);
app.delete('/:article_id', borrarArticulo);
app.put('/:article_id', actualizarArticulo);


// Ruta POST para crear un nuevo artículo.
function crearArticulo(req, res) {
    const nuevoArticulo = {
        title: req.body.title,
        publication_date: req.body.publication_date,
        content: req.body.content,
        user_id: req.body.user_id,
        category_id: req.body.category_id
    };

    articles_db.create(nuevoArticulo, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al crear el artículo',
                detail: error
            });
        } else {
            res.status(201).json({
                message: 'Artículo creado con éxito',
                detail: resultado
            });
        }
    });
}

// Ruta GET para obtener todos los artículos.
function getAllArticulos(req, res) {
    articles_db.getAll((error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener los artículos',
                detail: error
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

// Ruta GET para obtener un artículo por su ID.
function getArticuloPorId(req, res) {
    const article_id = req.params.article_id;

    articles_db.getById(article_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener el artículo',
                detail: error
            });
        } else if (!resultado) {
            res.status(404).json({
                error: true,
                message: 'No se encontró un artículo con el ID proporcionado'
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

// Ruta DELETE para eliminar un artículo por su ID.
function borrarArticulo(req, res) {
    const article_id = req.params.article_id;

    articles_db.delete(article_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al eliminar el artículo',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró un artículo con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Artículo eliminado con éxito',
                detail: resultado
            });
        }
    });
}

// Ruta PUT para actualizar un artículo por su ID.
function actualizarArticulo(req, res) {
    const article_id = req.params.article_id;
    const datosActualizados = {
        title: req.body.title,
        publication_date: req.body.publication_date,
        content: req.body.content,
        user_id: req.body.user_id,
        category_id: req.body.category_id
    };
    articles_db.update(datosActualizados, article_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al actualizar el artículo',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró un artículo con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Artículo actualizado con éxito',
                detail: resultado
            });
        }
    });
}


// Exporta la aplicación para su uso en otros archivos.
module.exports = app;
