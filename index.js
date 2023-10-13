// Importa el módulo 'rootpath' para resolver rutas de manera más sencilla.
require('rootpath')();

// Importa las bibliotecas necesarias
const express = require('express')
const app = express()
const morgan = require('morgan');


// Importa el módulo 'cors' para permitir solicitudes cruzadas entre dominios.
var cors = require('cors')
app.use(cors())

// Configura Express para analizar JSON y datos de formulario.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utiliza el middleware 'morgan' para registrar solicitudes HTTP.
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

// Importa la configuración desde el archivo 'config.json' para levantar el servidor.
const configuracion = require("./backend/config.json");
 
// Importa el controlador de personas.
const personsController = require("./backend/controller/personsController.js");

//importa el controlador de usuarios.
const usersController = require("./backend/controller/usersController.js");

//importa el controlador de roles.
const rolesController = require ("./backend/controller/rolesController.js");

//importa el controlador de seguridad
const securityController = require("./backend/controller/securityController.js");

 // Importa el controlador de imágenes
const imagesController = require("./backend/controller/imagesController.js");

 //Importa el controlador de artículos
const articlesController = require("./backend/controller/articlesController");

//Importa el controlador de categorías
const categoriesController = require("./backend/controller/categoriesController");

//Importa el controlador de comentarios
const commentsController = require("./backend/controller/commentsController");



// Define una ruta para cada tabla y asigna el controlador correspondiente a ella.

app.use('/persons', personsController);
app.use('/users', usersController);
app.use('/roles',rolesController);
app.use('/security',securityController.app);
app.use('/images',imagesController);
app.use('/articles',articlesController);
app.use('/categories',categoriesController);
app.use('/comments',commentsController);




// Inicia el servidor en el puerto 8080 y maneja posibles errores.
app.listen(8080, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("sevidor escuchando en el puerto " + configuracion.server.port );
    }
});






























