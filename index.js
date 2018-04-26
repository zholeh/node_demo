'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
var jsonParser = bodyParser.json();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Headers', ['Content-Type']);
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', ['DELETE', 'PUT', 'GET', 'POST']);
    next();
});

app.use(express.static(__dirname + "/public"));

app.get("/api/users", function (req, res) {

    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    res.send(users);
});
app.get("/api/users/:id", function (req, res) {

    var id = req.params.id; // получаем id
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});
app.get("/api/checkuser/:user", function (req, res) {

    let user = JSON.parse(req.params.user);

    let userId = '';
    let content = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(content);
    
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == user.name && 
            users[i].password == user.password ) {
            userId = '' + users[i].id;
            break;
        }
    }
    res.send(userId);
});

app.post("/api/users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var userName = req.body.name;
    var userAge = req.body.age;
    var userpassword = req.body.password;
    var user = { name: userName, age: userAge, password: userpassword };

    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);

    var id = Math.max.apply(Math, users.map(function (o) { return o.id; }))
    user.id = id + 1;
    users.push(user);
    var data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    res.send(user);
});

app.delete("/api/users/:id", function (req, res) {

    var id = req.params.id;
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var index = -1;

    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        var user = users.splice(index, 1)[0];
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

app.put("/api/users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var userId = req.body.id;
    var userName = req.body.name;
    var userAge = req.body.age;
    var userpassword = req.body.password;

    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var user;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            user = users[i];
            break;
        }
    }
    if (user) {
        user.age = userAge;
        user.name = userName;
        user.password = userpassword;
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else {
        res.status(404).send(user);
    }
});

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});
