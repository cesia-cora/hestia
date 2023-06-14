## Hestia Cooking
<br>
A cooking web app to share dessert recipes.
This was created as a practice after a long training course with Express.js and MySQL.

<br>

### Why "Hestia"?

Hestia is the greek goddess of the hearth.

<br>

### How to run:
Run the SQL port

`npm install` (to install all dependencies)

`node --watch app.js`

<br>

### Features:

- CRUD
    - image uploading
- Authenthication
    - register, log in, log out, encrypted password, profile view

### Dependencies:

- Express.js
- Sequelize
- Cookie-session
- Bcrypt
- Multer/Sharp

### Routes:

`localhost:3000/recetas
localhost:3000/recetas/crear
localhost:3000/recetas/{id}
localhost:3000/recetas/{id}/editar
localhost:3000/recetas/{id}/eliminar
localhost:3000/categorias
localhost:3000/categorias/{id}
localhost:3000/perfil/{id}`