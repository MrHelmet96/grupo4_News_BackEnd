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
  const { mail, password} = req.body;
  // Busca un usuario en la base de datos por su dirección de correo electrónico.
  users_db.findByEmail(mail, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Compara la contraseña proporcionada con la almacenada en la base de datos.
      const iguales = bcrypt.compareSync(password, result.detail.password);
      if (iguales) {
        let user = {
          mail: result.detail.email,
          rol_id:result.detail.rol_id,

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
  
  //viene el token desde front en headers
  const tokenFront = (req.headers.authorization); 
  
  if (tokenFront) {

    // Extrae el token que viene desde el front sin las comillas
    const token = tokenFront.replace(/^"(.*)"$/, '$1');

    try {
      
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







  
  // if (req.headers) {
  //   try {
  //     const token = (req.headers["Authorization"]);
  //     const verified = jwt.verify(token, "Grupo4Sectret");
      
  //     console.log(req.headers)
  //     if (verified) {
  //       next();
  //     } else {
  //       res.status(403).send({
  //         message: "Token invalido, permiso denegado.",
  //       });
  //     }
  //   } catch (error) {
  //     res.status(403).send({
  //       message: "Acceso Denegado err",
  //     });
  //   }
  // } else {
  //   res.status(403).send({
  //     message: "No posee token de autorizacion",
  //   });
  // }
}

// Exporta el objeto 'app' y la función 'verificarToken' para su uso en otras partes del programa.
module.exports = { app, verificarToken };
