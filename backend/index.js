const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");

const app = express();
const port = process.env.PORT || 5000;

const profile = require('./routes/profile');
const users = require('./routes/users');
const posts = require('./routes/users');

dotenv.config();


// Midlleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// Passport config
app.use(passport.initialize())
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts)

app.get('/', (req, res) => {
    res.send('Hello Sirin')
})


// Connected to the mongo DB and run the server

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Conneted to the DB'))
.then(() => {
    app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))
})
.catch(err => console.log(err));