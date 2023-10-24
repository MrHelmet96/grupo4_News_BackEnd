# [Grupo 4 Noticias | Backend](https://github.com/MrHelmet96/grupo4_noticias/tree/main)
Este repositorio contiene el código backend del trabajo integrador final para el curso de *Desarrollo Web Fullstack* de **Silicon Misiones** (comisión A). 

--> En este repositorio se almacena el código fuente para la creación de una *web de noticias internas* para las diferentes áreas de trabajo en la insitución *Silicon Misiones*. En la misma, se podrán registrar todos los trabajadores de la institución para ingresar al sitio a leer las noticias institucionales. Un *Súper-Admin* Podrá ingresar a la web para modificar el rol de algunos usuarios y convertirlos en *editores* y así podrán ingresar a la web para escribir, editar y eliminar las noticias de sus respectivas áreas. La finalidad de esta web es colaborar con la comunicación interna institucional y brindarle a los trabajadores una herramienta accesible e intuitiva de gestión de la información.

### Autores:
* Alejandro M. Casco
* Natasha Falicoff
* Pablo Rivas
<!-- * Emiliano Alvarez -->

*FUNCIONAMIENTO DEL PROYECTO (BACKEND):*
### Para que el backend del proyecto funcione correctamente, luego de clonar el proyecto, es necesario instalar las siguientes librerías en la terminal de la consola con los comandos:
npm install express
npm install mysql2
npm install rootpath
npm install morgan
npm install bcrypt
npm install jsonwebtoken
npm install cors
npm install tar

*Además, es necesario crear localmente la base de datos MYSQL:*
Teniendo en cuenta de modificar los campos del archivo /config.json para que coincidan con la base de datos del repositorio local.