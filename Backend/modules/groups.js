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
                            const memUserID = req.body.groupMembers[i].value;
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

router.get('/mygroups/:userID', (req, res) => {
    //const userID = req.body.userID
    const userID = req.params.userID
    const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE INVITE_FLAG = 'A' AND USER_ID = " + userID
    console.log(groupCountQuery);

    con.query(groupCountQuery, function (err, result, fields) {
        if (err) {
            console.log("Group count error");
            res.status(500).send("Error");
            return;
        } else if (result[0].COUNT < 1) {
            console.log("User is not part of any group");
            res.status(201).send("You are not a part of any group");
            return;
        } else {
            const getGroupsQuery = "SELECT E.GROUP_NAME, E.GROUP_ID, U.INVITE_FLAG FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_ID = U.GROUP_ID AND U.INVITE_FLAG = 'A' AND U.USER_ID = " + userID
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

router.get('/mygroupspending/:userID', (req, res) => {
    //const userID = req.body.userID
    const userID = req.params.userID
    const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE INVITE_FLAG = 'P' AND USER_ID = " + userID
    //const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE USER_ID = " + userID
    console.log(groupCountQuery);

    con.query(groupCountQuery, function (err, result, fields) {
        if (err) {
            console.log("Group count error");
            res.status(500).send("Error");
            return;
        } else if (result[0].COUNT < 1) {
            console.log("User does not have any pending invites");
            res.status(201).send("You do not have any pending invites");
            return;
        } else {
            const getGroupsQuery = "SELECT E.GROUP_NAME, E.GROUP_ID, U.INVITE_FLAG FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_ID = U.GROUP_ID AND U.INVITE_FLAG = 'P' AND U.USER_ID = " + userID
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
            console.log(result.affectedRows);
            const queryResult = result.affectedRows;
            res.status(200).json({ "rowsAffected": queryResult });
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

router.get('/groupdetails/:groupID', (req, res) => {
    const groupID = req.params.groupID;

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

router.get('/search/users', (req, res) => {
    //const userID = req.body.userID;
    const userInput = req.query.keyword
    const userSearchQuery = "SELECT USER_ID, USER_EMAIL, USER_NAME FROM USERS WHERE USER_NAME LIKE '%" + userInput + "%' OR USER_EMAIL LIKE '%" + userInput + "%'";
    // console.log(profileViewQuery);
    con.query(userSearchQuery, function (err, users, fields) {
        if (err) {
            res.status(500).send('Error');
        } else {
            console.log("=========Search User Backend=========");
            console.log(users);
            res.status(200).json({
                // 'userID': result[0].USER_ID,
                // 'userEmail': result[0].USER_EMAIL,
                // 'userName': result[0].USER_NAME,
                users
            });
        }
    });
});

router.get('/search/groups/:userID', (req, res) => {
    const userID = req.params.userID
    const userInput = req.query.keyword
    // const groupSearchQuery = "SELECT USER_ID, USER_EMAIL, USER_NAME FROM USERS WHERE USER_NAME LIKE '%"+userInput+"%' OR USER_EMAIL LIKE '%"+userInput+"%'";
    const groupSearchQuery = "SELECT E.GROUP_ID, E.GROUP_NAME FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_NAME LIKE '%" + userInput + "%' AND E.GROUP_ID = U.GROUP_ID AND U.INVITE_FLAG = 'A' AND U.USER_ID = " + userID;
    con.query(groupSearchQuery, function (err, groups, fields) {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log("=========Search Group Backend=========");
            console.log(groups);
            res.status(200).json({
                groups
            });
        }
    });
});

router.get('/groupbalances/:groupID', (req, res) => {
    const groupID = req.params.groupID
    const groupExpenseQuery = "SELECT UGM.GROUP_ID, UGM.USER_ID , U.USER_NAME, (SELECT SUM(T.AMOUNT) FROM `TRANSACTION` T WHERE T.GROUP_ID = UGM.GROUP_ID AND T.PAID_BY_USER_ID = UGM.USER_ID AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N') - (SELECT SUM(T.AMOUNT) FROM `TRANSACTION` T WHERE T.GROUP_ID = UGM.GROUP_ID AND T.PAID_FOR_USER_ID = UGM.USER_ID AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N') AS OWE_AMOUNT FROM USER_GROUP_MAP UGM, USERS U WHERE U.USER_ID = UGM.USER_ID AND UGM.GROUP_ID = " + groupID
    con.query(groupExpenseQuery, function (err, result, fields) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.get('/groupexpenses/:groupID', (req, res) => {
    const groupID = req.params.groupID
    const groupExpenseQuery = "SELECT E.*, U.USER_NAME FROM EXPENSES E, USERS U WHERE U.USER_ID = E.PAID_BY_USER_ID AND E.GROUP_ID = "+ groupID +" ORDER BY EXP_ID DESC"
    con.query(groupExpenseQuery, function (err, result, fields) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

module.exports = router;