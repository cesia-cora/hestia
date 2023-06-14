## Hestia Cooking
<br>
A cooking web app to share dessert recipes.
This was created as a practice after a long training course with Express.js and MySQL.

### Why "Hestia"?

Hestia is the greek goddess of the hearth.

### How to run:
1. Run the SQL port

2. `npm install` (to install all dependencies)

3. `node --watch app.js`

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