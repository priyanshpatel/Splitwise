'use strict'
const { group } = require('console');
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
    let groupID = null;

    const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM EXPENSE_GROUPS WHERE GROUP_NAME = '" + groupName + "'";
    console.log(groupCountQuery);
    con.query(groupCountQuery, function (err, result, fields) {
        if (err) {
            console.log("Group count error");
            res.status(500).send("Error");
            return;
        } else if (result[0].COUNT > 0) {
            console.log("Group name already exists.");
            res.status(201).send("Group name already exists");
            return;
        } else {
            const createGroupQuery = "INSERT INTO EXPENSE_GROUPS(GROUP_NAME, CREATED_BY, CREATE_DATE, GROUP_PICTURE) VALUES ('" + groupName + "'," + userID + ",'" + ts + "','" + groupPicture + "')";

            con.query(createGroupQuery, function (err, result, fields) {
                if (err) {
                    console.log("error1");
                    res.status(500).send('Error while creating group');
                    return;
                }
                else {
                    const lastGroupIDQuery = "SELECT MAX(GROUP_ID) AS GROUP_ID FROM EXPENSE_GROUPS";
                    con.query(lastGroupIDQuery, function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            res.status(500).status(err);
                            return;
                        }
                        else {
                            groupID = result[0];
                        }
                    });

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
                        res.status(200).send(groupID);

                    });
                }
            });


        }
    });


});

router.get('/mygroups', (req, res) => {
    const userID = req.body.userID

    const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE USER_ID = " + userID
    console.log(groupCountQuery);

    con.query(groupCountQuery, function (err, result, fields) {
        if (err) {
            console.log("Group count error");
            res.status(500).send("Error");
            return;
        } else if (result[0].COUNT < 1) {
            console.log("User is not part of any group.");
            res.status(201).send("You are not part of any group");
            return;
        } else {
            const getGroupsQuery = "SELECT E.GROUP_NAME, E.GROUP_ID FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_ID = U.GROUP_ID AND U.USER_ID = " + userID
            console.log(getGroupsQuery);
            con.query(getGroupsQuery, function (err, result, fields) {
                if (err) {
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

router.post('/acceptrejectinvite', (req, res) => {
    const groupID = req.body.groupID;
    const userID = req.body.userID;
    const flag = req.body.flag;

    const acceptRejectQuery = "UPDATE USER_GROUP_MAP U SET U.INVITE_FLAG = '" + flag + "' WHERE U.GROUP_ID = " + groupID + " AND U.USER_ID = " + userID
    console.log(acceptRejectQuery);

    con.query(acceptRejectQuery, function (err, result, fields) {
        if (err) {
            console.log("Error updating invite flag");
            res.status(500).send("Error updating Invite");
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    });

})

router.post('/leave', (req, res) => {
    const groupID = req.body.groupID;
    const userID = req.body.userID;

    const leaveGroupQuery = "DELETE FROM USER_GROUP_MAP WHERE GROUP_ID = " + groupID + " AND USER_ID = " + userID
    console.log(leaveGroupQuery);

    con.query(leaveGroupQuery, function (err, result, fields) {
        if (err) {
            console.log("Error while leaving group");
            res.status(500).send("Error while leaving group");
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    });
})

router.get('/groupdetails', (req, res) => {
    const groupID = req.body.groupID;

    const getGroupDetailsQuery = "SELECT * FROM EXPENSE_GROUPS WHERE GROUP_ID = " + groupID

    con.query(getGroupDetailsQuery, function (err, result, fields) {
        if (err) {
            console.log("Error while getting group details");
            res.status(500).send("Error while getting group details");
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    });
});

router.post('/update', (req, res) => {
    const groupID = req.body.groupID;
    const groupName = req.body.groupName;
    const groupPicture = req.body.groupPicture;
    const updateGroupDetails = "UPDATE EXPENSE_GROUPS SET GROUP_NAME = '" + groupName + "', GROUP_PICTURE = '" + groupPicture + "' WHERE GROUP_ID = " + groupID

    con.query(updateGroupDetails, function (err, result, fields) {
        if (err) {
            console.log("Error while updating group details");
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(201).send('Group name already exists');
            } else {
                res.status(500).send(err);
            }
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    });
});

module.exports = router;