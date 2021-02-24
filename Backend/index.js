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

const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'rds-splitwise.cfxty5nkulfg.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'saiyangoku',
    database: 'RDS_SPLITWISE',
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.post('/login', (req, res) => {
    console.log(req.body)
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;

    console.log(userEmail);
    console.log(userPassword);

    console.log('Inside Login Post Request');

    const loginQuery = "SELECT * FROM USERS WHERE USER_EMAIL = '" + userEmail + "'";
    console.log("Query: " + loginQuery);

    con.query(loginQuery, function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        console.log(result[0].USER_PASSWORD);
        userDBPassword = result[0].USER_PASSWORD

        let passCheck = bcrypt.compareSync(userPassword, userDBPassword)
        // let passCheck = true;
        if (passCheck) {
            res.cookie('cookie', userEmail, { maxAge: 900000, httpOnly: false, path: '/' });
            req.session.user = result[0];
            console.log("login success");
            res.status(200).send("Login Success");

        } else {
            res.status(400).send("Login Failed");
            console.log("login failed");
        }
    });
});
app.post('/signup', (req, res) => {
    console.log(req.body);
    // name emailid and password, email id should be unique
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;

    console.log("Inside signup post");

    const signupCheckQuery = "SELECT COUNT(0) AS COUNT FROM USERS WHERE USER_EMAIL = '" + userEmail + "'";
    console.log("Query: " + signupCheckQuery);

    con.query(signupCheckQuery, function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].COUNT);
        if (result[0].COUNT > 0) {
            res.status(400).send("Email already exists.");
        } else {
            //const encryptedPassword = async(userPassword) => await bcrypt.hash(userPassword, await bcrypt.genSalt());
            const hashedPassword = bcrypt.hashSync(userPassword, 10);
            console.log("Encrypted password: "+hashedPassword);
            signupQuery = "INSERT INTO USERS(USER_EMAIL, USER_NAME, USER_PASSWORD) VALUES ('" + userEmail + "','" + userName + "','" + hashedPassword + "')";
            console.log(signupQuery);
            con.query(signupQuery, function (err, result, fields) {
                if (err) {
                    res.status(500).send('Error');
                    throw err;
                } else {
                    res.status(200).send("Signup successful");
                }
            });
        };
    });

});


app.listen(3000);
console.log("Server Listening on port 3000");

