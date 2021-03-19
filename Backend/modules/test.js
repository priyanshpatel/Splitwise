const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;
// Test variables

it("Login", function (done) {
    chai
        .request("http://127.0.0.1:3001")
        .post("/login")
        .send({ userEmail: "test117@gmail.com", userPassword: "qwerty12345" })
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
});

it("Gets profile details", function (done) {
    chai
        .request("http://127.0.0.1:3001")
        .get("/profile/19")
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
});

it("User should not be allowed to leave group without settling up", function (done) {
    chai
        .request("http://127.0.0.1:3001")
        .post("/groups/leave")
        .send({ groupID: 62, userID: 17 })
        .end((err, res) => {
            expect(res).to.have.status(201);
            done();
        });
});

it("Gets group details", function (done) {
    chai
        .request("http://127.0.0.1:3001")
        .get("/groups/groupdetails/21")
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
});

it("Settle up dropdown", function (done) {
    chai
        .request("http://127.0.0.1:3001")
        .get("/activities/settleup/dropdown/16")
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
});