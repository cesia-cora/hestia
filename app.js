const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require("method-override");
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname + '/public')));

const cookie = require("cookie-session");
app.use(
  cookie({
    name: "session",
    keys: ["S3cr3t0!"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + '/src/views'));

const connection = require('./src/models/connection');

app.use('/recipes', require('./src/routes/recipes'));
app.use('/categories', require('./src/routes/categories'));
app.use('/profile', require('./src/routes/profile'));
app.use(require('./src/routes/auth'));

app.get('/', (req, res) => {
  console.log('id: ', req.session.userId, ' username: ', req.session.username);
  res.render('index', {user: req.session.userId, username: req.session.username});
});

app.get('/search', (req, res) => {
  res.send('aleluya')
})

// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   console.error(err);
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: err
//   });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));