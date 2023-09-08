import express from "express";
import cors from "cors";
import crypto from "crypto";
import DB from "./DB.js";

const app = express();
app.use(express.json());
app.use(cors())

let peopleLoggedIn = [];

app.post("/login", async (req, res) => {
    let hash = crypto.createHash("sha256")

    const usuario = await DB.getUser(req.body.name);
    
    if(typeof usuario === "undefined") {
        res.status(401); //unauthorized
        res.send(JSON.stringify({error: "User does not exist"}));
        return;
    }

    hash.update(req.body.pwd);
    const providedPwd = hash.digest("hex");

    if(usuario.pwd !== providedPwd) {
        res.status(401);
        res.send(JSON.stringify({error: "Wrong password"}));
        return;
    }

    hash.update(crypto.randomInt(0, 140737488355328)); //2^47
    let newKey = hash.digest("hex");
    peopleLoggedIn.push(newKey);

    res.status(200);
    res.send(newKey);
});

app.post("/registro", async (req, res) => {
    if (typeof await DB.getUser(req.body.name) !== "undefined") { //chequear
        res.status(400); //Bad request
        res.send({error: "User already exists"});
        return;
    }

    let hash = crypto.createHash("sha256");

    hash.update(req.body.pwd);
    const hashedPwd = hash.digest("hex");
    req.body.pwd = hashedPwd;

    const result = await DB.insertUser(req.body);

    res.status(201);
    res.send("Ok");
})

app.use((req, res, next) => {
    if(typeof peopleLoggedIn.find(req.headers.authorization) !== "undefined") {
        next();
    }
    res.status(401);
    res.send("Unauthorized");
    return;
})

app.patch("/updateUser", async (req, res) => {
    
})

app.listen(8080, 'localhost', () => {
    console.log("listening on port 8080");
})