const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const comments_db = require('../model/comments');

app.post('/', crearComentario);
app.get('/', getAllComentarios);
app.get('/:comment_id', getComentarioPorId);
app.delete('/:comment_id', borrarComentario);
app.put('/:comment_id', actualizarComentario);

function crearComentario(req, res) {
    const nuevoComentario = {
        content: req.body.content,
        user_id: req.body.user_id,
        article_id: req.body.article_id,
        comment_date: req.body.comment_date
    };

    comments_db.create(nuevoComentario, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al crear el comentario',
                detail: error
            });
        } else {
            res.status(201).json({
                message: 'Comentario creado con éxito',
                detail: resultado
            });
        }
    });
}

function getAllComentarios(req, res) {
    comments_db.getAll((error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener los comentarios',
                detail: error
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

function getComentarioPorId(req, res) {
    const comment_id = req.params.comment_id;

    comments_db.getById(comment_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al obtener el comentario',
                detail: error
            });
        } else if (!resultado) {
            res.status(404).json({
                error: true,
                message: 'No se encontró un comentario con el ID proporcionado'
            });
        } else {
            res.status(200).json(resultado);
        }
    });
}

function borrarComentario(req, res) {
    const comment_id = req.params.comment_id;

    comments_db.delete(comment_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al eliminar el comentario',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró un comentario con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Comentario eliminado con éxito',
                detail: resultado
            });
        }
    });
}

function actualizarComentario(req, res) {
    const comment_id = req.params.comment_id;
    const datosActualizados = {
        content: req.body.content,
        user_id: req.body.user_id,
        article_id: req.body.article_id,
        comment_date: req.body.comment_date
    };

    comments_db.update(datosActualizados, comment_id, (error, resultado) => {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Error al actualizar el comentario',
                detail: error
            });
        } else if (resultado.detail.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró un comentario con el ID proporcionado'
            });
        } else {
            res.status(200).json({
                message: 'Comentario actualizado con éxito',
                detail: resultado
            });
        }
    });
}

module.exports = app;
