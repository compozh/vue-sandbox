const express = require('express')

const app = express()
const passport = require('passport')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('hello from server')
})

app.post('/login',
  passport.authenticate('local'), (req, res) => {
    console.log('', req.user)
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });

app.listen(3000, () => console.log('Server has started...', ))
