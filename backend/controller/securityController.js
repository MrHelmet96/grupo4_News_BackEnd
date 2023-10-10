//en contrucción

require('rootpath')();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var users_db = require("../model/users");


app.post('/login', login);


function login(req, res) {


    const { email, password } = req.body; 

    users_db.findByEmail(email, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            
            const iguales = bcrypt.compareSync(password, result.detail.password);
            console.log("pase por aca buscando email")//console coment quitar luego
            if (iguales) {
                let user = {
                    
                    email: result.detail.email
                    
                }
        

                jwt.sign(user, 'siliconSectret', { expiresIn: '600s' }, (err, token) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                    } else {
                        res.json({
                            datos: user,
                            token: token
                        });
                    }
                })
            } else {
                res.status(403).send({
                    message: 'Contraseña Incorrecta'
                });
            }
        }
    });
}


function verificarToken(req, res, next) {
    if (req.headers["authorization"]) {
        try {
            const token = req.headers["authorization"]
            const verified = jwt.verify(token, "siliconSectret");
            if (verified) {
                next();
            } else {
                res.status(403).send({
                    message: "Token invalido, permiso denegado"
                });

            }

        } catch (error) {
            res.status(403).send({
                message: "Acceso Denegado"
            });
        }

    } else {
        res.status(403).send({
            message: "No posee token de autorizacion"
        });
    }
}

module.exports = { app, verificarToken };

