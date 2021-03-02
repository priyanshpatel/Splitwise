'use strict'
const express = require('express');
const router = express.Router();
const con = require('./database');

router.post('/create', (req, res) => {
    const userID = req.body.userID
    const groupName = req.body.groupName
    const groupPicture = req.body.groupPicture
    const groupMembers = req.body.groupMembers
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const groupCount = 0;

    const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM EXPENSE_GROUPS WHERE GROUP_NAME = '"+groupName+"'";
    console.log(groupCountQuery);
    con.query(groupCountQuery, function(err, result, fields){
        if(err){
            console.log("Group count error");
            res.status(500).send("Error");
            return;
        } else if(result[0].COUNT > 0){
            console.log("Group name already exists.");
            res.status(200).send("Group name already exists");
            return;
        }else{
            const createGroupQuery = "INSERT INTO EXPENSE_GROUPS(GROUP_NAME, CREATED_BY, CREATE_DATE, GROUP_PICTURE) VALUES ('" + groupName + "'," + userID + ",'" + ts + "','" + groupPicture + "')";

            con.query(createGroupQuery, function (err, result, fields) {
                if (err) {
                    console.log("error1");
                    res.status(500).send('Error');
                    return;
                }
                else{
                const mainUserAddQuery = "INSERT INTO USER_GROUP_MAP(USER_ID, GROUP_ID, ADDED_BY, ADDED_DATE, INVITE_FLAG, JOIN_DATE) SELECT EXPENSE_GROUPS.CREATED_BY, EXPENSE_GROUPS.GROUP_ID, EXPENSE_GROUPS.CREATED_BY, EXPENSE_GROUPS.CREATE_DATE, 'A', EXPENSE_GROUPS.CREATE_DATE FROM EXPENSE_GROUPS WHERE EXPENSE_GROUPS.GROUP_NAME = '" + groupName + "'";
                con.query(mainUserAddQuery, function (err, result, fields) {
                    if (err) {
                        console.log("error2");
                        res.status(500).send('Error');
                        return;
                    }
                    for (let i = 0; i < groupMembers.length; i++) {
                        const memUserID = req.body.groupMembers[i].userID;
                        const memAddQuery = "INSERT INTO USER_GROUP_MAP(USER_ID, GROUP_ID, ADDED_BY, ADDED_DATE, INVITE_FLAG) SELECT " + memUserID + ", EXPENSE_GROUPS.GROUP_ID, " + userID + ", '" + ts + "', 'P' FROM EXPENSE_GROUPS WHERE EXPENSE_GROUPS.GROUP_NAME = '" + groupName + "'";
                        console.log(memAddQuery);
                        con.query(memAddQuery, function (err, result, fields) {
                            if (err) {
                                console.log("error3");
                                return;
                            }
                        });
                    }
                    res.status(200).send("Group Created SuccessFully");
        
                });
            }
            });

            
        }
    });

    
});

router.get('/mygroups', (req,res) => {
    const userID = req.body.userID

    const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE USER_ID = "+userID
    console.log(groupCountQuery);

    con.query(groupCountQuery, function(err, result, fields){
        if(err){
            console.log("Group count error");
            res.status(500).send("Error");
            return;
        } else if(result[0].COUNT < 1){
            console.log("User is not part of any group.");
            res.status(201).send("You are not part of any group");
            return;
        } else {
            const getGroupsQuery = "SELECT E.GROUP_NAME as GROUP_NAME FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_ID = U.GROUP_ID AND U.USER_ID = "+userID
            console.log(getGroupsQuery);
            con.query(getGroupsQuery, function(err, result, fields){
                if(err){
                    console.log("error getting groups");
                    res.status(500).send("error getting groups");
                    return;
                } else {
                    console.log(result);
                    res.status(200).send(result);
                }
            });
        }
    });

});

module.exports = router;