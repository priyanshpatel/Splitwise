// import the require dependencies
const express = require('express');

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

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const user_id = 0;

app.post('/login', (req, res) => {
    console.log(req.body)
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    
    console.log(userEmail);
    console.log(userPassword);

  console.log('Inside Login Post Request');
  
  const loginQuery = "SELECT * FROM USERS WHERE USER_EMAIL = '"+userEmail+"'";
  console.log("Query: "+loginQuery);

  con.query(loginQuery, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
   
    console.log(result[0].USER_PASSWORD);
    userDBPassword = result[0].USER_PASSWORD

    // let passCheck = bcrypt.compareSync(userPassword, userDBPassword)
    let passCheck = true;
    if(passCheck){
        res.cookie('cookie', userEmail, { maxAge: 900000, httpOnly: false, path: '/' });
        req.session.user = result[0];
        console.log("login success");
        res.status(200).send("Login Success");

    } else{
        res.status(400).send("Login Failed");
        console.log("login failed");
    }
   });

//   Users.filter((user) => {
//     if (user.username === req.body.username && user.password === req.body.password) {
//       res.cookie('cookie', 'admin', { maxAge: 900000, httpOnly: false, path: '/' });
//       req.session.user = user;
//       res.writeHead(200, {
//         'Content-Type': 'text/plain',
//       });
//       res.end('Successful Login');
//     }
//   });
});

app.listen(3000);
console.log("Server Listening on port 3000");
