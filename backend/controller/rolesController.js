require('rootpath')();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var roles_db = require("../model/roles.js");

app.post('/roles', crearRole);

function crearRole(req, res) {
    let roleName = req.body.role_name;
    roles_db.create(roleName, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

module.exports = app;
