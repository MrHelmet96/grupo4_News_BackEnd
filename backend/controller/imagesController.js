// Importa el módulo 'express' para gestionar y lanzar servidores web.
const express = require('express');
const app = express();

// Middleware para analizar solicitudes en formato JSON y datos de formulario.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importa el módulo 'images_db' que contiene las funciones relacionadas con las imágenes.
const images_db = require('../model/images');

// Definición de rutas de escucha (endpoints) disponibles para IMÁGENES.
app.post('/', crearImagen);
app.get('/', getAllImagenes);
app.delete('/:image_id', borrarImagen);
app.put('/:image_id', actualizarImagen);

// Función para manejar la solicitud POST para crear una nueva imagen.
function crearImagen(req, res) {
    const nuevaImagen = {
        url: req.body.url,
        article_id: req.body.article_id
    };

    images_db.create(nuevaImagen, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al crear la imagen',
                detail: error
            });
        } else {
            res.status(201).json({
                message: 'Imagen creada con éxito',
                detail: resultado
            });
        }
    });
}

// Función para manejar la solicitud GET para obtener todas las imágenes.
function getAllImagenes(req, res) {
    images_db.getAll((error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener las imágenes',
                detail: error
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

// Función para manejar la solicitud DELETE para eliminar una imagen por su ID.
function borrarImagen(req, res) {
    const image_id = req.params.image_id;

    images_db.delete(image_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al eliminar la imagen',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró una imagen con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Imagen eliminada con éxito',
                detail: resultado
            });
        }
    });
}

// Función para manejar la solicitud PUT para actualizar una imagen por su ID.
function actualizarImagen(req, res) {
    const image_id = req.params.image_id;
    const datosActualizados = {
        url: req.body.url,
        article_id: req.body.article_id
    };

    images_db.update(datosActualizados, image_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al actualizar la imagen',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró una imagen con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Imagen actualizada con éxito',
                detail: resultado
            });
        }
    });
}

// Exporta la aplicación 'app' para que pueda ser utilizada en otros archivos.
module.exports = app;
