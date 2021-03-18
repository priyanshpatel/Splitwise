'use strict'
// import the require dependencies
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.set('view engine', 'ejs');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
    secret: 'splitwise_secure_string',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Sess : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Doubt, might have to remove later

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

const con = require('./modules/database')
const login = require('./modules/login')
const signup = require('./modules/signup')
const profile = require('./modules/profile')
const groups = require('./modules/groups')
const expenses = require('./modules/expenses')
const dashboard = require('./modules/dashboard')
const activities = require('./modules/activities')

app.use('/login', login)
app.use('/signup', signup)
app.use('/profile', profile)
app.use('/groups', groups)
app.use('/expenses', expenses)
app.use('/dashboard', dashboard)
app.use('/activities', activities)

app.use(express.static("public"));

app.listen(3001);
console.log("Server Listening on port 3001");

