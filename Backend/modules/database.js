'use strict';

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
module.exports = con;