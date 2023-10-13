// Importa el módulo 'rootpath' para configuraciones iniciales.
require("rootpath")();

// Importa el módulo 'express' para crear una aplicación web.
const express = require("express");
const app = express();

// Importa los módulos 'jsonwebtoken' para la gestión de tokens JWT y 'bcrypt' para el cifrado de contraseñas.
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Importa el módulo 'users_db' que contiene las funciones para interactuar con la base de datos de usuarios.
var users_db = require("../model/users");

// Define una ruta POST '/login' para la autenticación de usuarios.
app.post("/login", login);

// Función de autenticación para la ruta POST '/login'.
function login(req, res) {
  const { email, password } = req.body;
  // Busca un usuario en la base de datos por su dirección de correo electrónico.
  users_db.findByEmail(email, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Compara la contraseña proporcionada con la almacenada en la base de datos.
      const iguales = bcrypt.compareSync(password, result.detail.password);
      if (iguales) {
        let user = {
          email: result.detail.email,
        };
        // Genera un token JWT para el usuario autenticado.
        jwt.sign(user, "Grupo4Sectret", { expiresIn: "365d" }, (err, token) => {
          if (err) {
            res.status(500).send({
              message: err,
            });
          } else {
            res.json({
              datos: user,
              token: token,
            });
          }
        });
      } else {
        res.status(403).send({
          message: "Contraseña Incorrecta",
        });
      }
    }
  });
}

// Función para verificar el token en las rutas protegidas.
function verificarToken(req, res, next) {
  // Este código que proporcionamos a continuación hay que descomentar para hardcodear el registro de los 3 primeros usuarios
  // para poder tener un usuario con cada rol definido y poder hacer las pruebas correspondientes.

  // if(req.body){
  //     next();
  // }
  // else{
  //     res.send({
  //      message: "error al crear usuario"
  //      });
  // }

  // Al momento de hardcodear el registro de los 3 suarios es necesario comentar las siguientes líneas de código.

  if (req.headers["Authorization"]) {
    try {
      const token = req.headers["Authorization"];
      const verified = jwt.verify(token, "Grupo4Sectret");
      if (verified) {
        next();
      } else {
        res.status(403).send({
          message: "Token invalido, permiso denegado.",
        });
      }
    } catch (error) {
      res.status(403).send({
        message: "Acceso Denegado err",
      });
    }
  } else {
    res.status(403).send({
      message: "No posee token de autorizacion",
    });
  }
}

// Exporta el objeto 'app' y la función 'verificarToken' para su uso en otras partes del programa.
module.exports = { app, verificarToken };
