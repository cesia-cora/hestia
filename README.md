## Hestia Cooking

![Static Badge](https://img.shields.io/badge/ejs-%5E3.1.8-darksalmon)
![Static Badge](https://img.shields.io/badge/express-%5E4.19.2-darkseagreen)
![Static Badge](https://img.shields.io/badge/mysql2-%5E3.9.7-steelblue)
![Static Badge](https://img.shields.io/badge/sequelize-%5E6.32.1-68aba6)
![Static Badge](https://img.shields.io/badge/puppeteer-%5E21.6.0-palevioletred)
![Static Badge](https://img.shields.io/badge/uuid-%5E9.0.1-mediumslateblue)

A cooking web app to share dessert recipes.
This was created as practice after a long training course with Express.js and MySQL.

### Why "Hestia"?

Hestia is the greek goddess of the hearth.

### Features:

- UI
    - Categories navigation
    - Pagination
    - PDF convertion
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
- Puppeteer
- Masonry-layout
- UUID

### How to run:
1. Run your MySQL port

2. Adjust src/models/connection.js with your database credentials (host, username, password, database name)

3. `npm install` (to install all dependencies)

4. Run local host `node --watch app.js` on the terminal

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
