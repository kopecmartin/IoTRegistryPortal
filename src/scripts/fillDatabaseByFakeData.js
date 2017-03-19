let mongoose = require('mongoose');
let User = require('../backEnd/models/user.js');
let UserGroup = require('../backEnd/models/userGroup.js');
let UserGroupMem = require('../backEnd/models/userGroupMem.js');


// Connect to the db
mongoose.connect("mongodb://localhost:33333");

let syncCounter = 0;

const exit = function () {
    if (syncCounter == 10) {
        console.log("Database was filled by data successfully!");
        mongoose.connection.close()
    }
};


let testUsers = [
    {
        email: "testUser1@mail.com",
        name: "Test User 1",
        password: "secret",
        meta: {
            firstName: "Test1",
            lastName: "User1",
            age: "18",
            gender: "male",
        }
    },
    {
        email: "testUser2@mail.com",
        name: "Test User 2",
        password: "secret",
        meta: {
            firstName: "Test2",
            lastName: "User2",
            age: "19",
            gender: "male",
        }
    },
    {
        email: "testUser3@mail.com",
        name: "Test User 3",
        password: "secret",
        meta: {
            firstName: "Test3",
            lastName: "User3",
            age: "20",
            gender: "male",
        }
    }
];

for (let user in testUsers) {
    // create a new user
    let newUser = User(testUsers[user]);
    newUser.save(function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('User ' + user.name + ' has been created!');
        syncCounter++;
    });
}

let testUserGroups = [
    {
        email: "testUser1@mail.com",
        name: "testGroup1",
        description: "This group owns user1",
        //permissions:
        path: "/",
    },
    {
        email: "testUser1@mail.com",
        name: "testGroup2",
        description: "This group owns user1 as well",
        //permissions:
        path: "/",
    },
    {
        email: "testUser2@mail.com",
        name: "testGroup3",
        description: "This group owns user2",
        //permissions:
        path: "/",
    },
];


// create groups and membership as well
for (let group in testUserGroups) {
    // create a new group
    let newGroup = UserGroup(testUserGroups[group]);
    newGroup.save(function (err, group) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Group ' + group.name + ' has been created!');
        syncCounter++;

        if(group.name == "testGroup3") {
            let userGroupMem = UserGroupMem({
                email: "testUser1@mail.com",
                groupID: group._id
            });
            userGroupMem.save(function (err, membership) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log('Membership for ' + membership.email + ' has been created!');
                syncCounter++;
                exit();
            });
        }
        else {
            // user2 is gonna be member of two groups: group1 and group2
            let userGroupMem = UserGroupMem({
                email: "testUser2@mail.com",
                groupID: group._id
            });

            userGroupMem.save(function (err, membership) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log('Membership for ' + membership.email + ' has been created!');
                syncCounter++;
                exit();
            });

            // testGroup2 is gonna have two members, user2 and user3
            if (group.name == "testGroup2") {
                let userGroupMem2 = UserGroupMem({
                    email: "testUser3@mail.com",
                    groupID: group._id
                });

                userGroupMem2.save(function (err, membership) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    console.log('Membership for ' + membership.email + ' has been created!');
                    syncCounter++;
                    exit();
                });
            }
        }
        exit();
    });
}
