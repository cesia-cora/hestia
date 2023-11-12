## Hestia Cooking

![Static Badge](https://img.shields.io/badge/ejs-%5E3.1.8-orange)
![Static Badge](https://img.shields.io/badge/express-%5E4.18.2-green)
![Static Badge](https://img.shields.io/badge/mysql-%5E2.18.1-blue)
![Static Badge](https://img.shields.io/badge/sequelize-%5E6.32.1-68aba6)

A cooking web app to share dessert recipes.
This was created as a practice after a long training course with Express.js and MySQL.

### Why "Hestia"?

Hestia is the greek goddess of the hearth.

### Features:

- UI
    - Categories navigation
    - Pagination
- Database
    - Create, view, edit and delete recipes
    - Image uploading
- Authenthication
    - Register, log in, log out, encrypted password, profile view

### Dependencies:

- Express.js
- Sequelize
- Cookie-session
- Bcrypt
- Multer/Sharp

### How to run:
1. Run your SQL port

2. `npm install` (to install all dependencies)

3. Run local host `node --watch app.js`

### Routes:

`localhost:3000/recipes`

`localhost:3000/recipes/create`

`localhost:3000/recipes/{id}`

`localhost:3000/recipes/{id}/edit`

`localhost:3000/recipes/{id}/update`

`localhost:3000/recipes/{id}/update_image`

`localhost:3000/recipes/{id}/destroy`

`localhost:3000/categories`

`localhost:3000/categories/{id}`

`localhost:3000/profile/{id}`
