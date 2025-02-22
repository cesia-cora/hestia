![Static Badge](https://img.shields.io/badge/ejs-%5E3.1.10-darksalmon?style=for-the-badge&logo=ejs)
![Static Badge](https://img.shields.io/badge/express-%5E4.21.2-darkseagreen?style=for-the-badge&logo=express)
![Static Badge](https://img.shields.io/badge/mysql2-%5E3.9.7-steelblue?style=for-the-badge&logo=mysql&logoColor=lightblue)
![Static Badge](https://img.shields.io/badge/sequelize-%5E6.37.5-68aba6?style=for-the-badge&logo=sequelize)
![Static Badge](https://img.shields.io/badge/puppeteer-%5E24.2.1-palevioletred?style=for-the-badge&logo=puppeteer)
![Static Badge](https://img.shields.io/badge/uuid-%5E11.1.0-mediumslateblue?style=for-the-badge)

## Hestia Cooking

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

2. Create an ".env" file and adjust your database credentials

Example:

`PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=1234
DB_NAME=hestia_project`

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
