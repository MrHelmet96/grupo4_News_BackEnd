-- Crear la base de datos grupo4_noticias_DB
CREATE DATABASE grupo4_noticias_DB;

-- Usar la base de datos recién creada
USE grupo4_noticias_DB;


-- Crear la tabla 'Roles' para almacenar los roles disponibles
CREATE TABLE roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50)
);

-- Insertar roles disponibles
INSERT INTO roles (role_name) VALUES ('user'), ('editor'), ('administrator');

-- Crear la tabla 'Users' para almacenar información de los usuarios
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60),
    surname VARCHAR(60),
    email VARCHAR(60)not null unique,
    password VARCHAR(80),
    rol_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(rol_id) 
);

-- Crear la tabla 'Categories' para almacenar las categorías de los artículos
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(60)
);

-- Insertar las categorías en la tabla 'categories'
INSERT INTO categories (category_name) VALUES
('Conocimiento'),
('Digital Factory'),
('Biotech'),
('I+D+I'),
('Negocios'),
('Misiones Gamer');

-- Crear la tabla 'Articles' para almacenar información de los artículos
CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    publication_date DATE,
    img_url VARCHAR(255),
    content MEDIUMTEXT,
    user_id INT,
    category_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- --Tabla para utilizar en la próxima etapa del proyecto:
-- -- Crear la tabla 'Images' para almacenar las URL de las imágenes
-- CREATE TABLE images (
--     image_id INT AUTO_INCREMENT PRIMARY KEY,
--     url VARCHAR(255),
--     article_id INT,
--     FOREIGN KEY (article_id) REFERENCES articles(article_id)
-- );

-- --Tabla para utilizar en la próxima etapa del proyecto:
-- -- Crear la tabla 'Comments' para almacenar los comentarios
-- CREATE TABLE comments (
--     comment_id INT AUTO_INCREMENT PRIMARY KEY,
--     content VARCHAR(255),
--     user_id INT,
--     article_id INT,
--     comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(user_id),
--     FOREIGN KEY (article_id) REFERENCES articles(article_id)
-- );

-- tabla no utilizada por cambios en el proyecto
-- -- Crear la tabla 'Persons' para almacenar información de las personas
-- CREATE TABLE persons (
--     person_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(60),
--     surname VARCHAR(60),
--     address VARCHAR(100),
--     phone_number VARCHAR(15)
-- );