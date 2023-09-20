import express from "express";
import cors from "cors";
import crypto from "crypto";
import DB from "./DB.js";

const app = express();
app.use(express.json());
app.use(cors())

let loggedUsers = [];

app.post("/login", async (req, res) => {
    const usuario = await DB.getUser(req.body.name);
    
    if(typeof usuario === "undefined") {
        res.status(401); //unauthorized
        res.send(JSON.stringify({error: "User does not exist"}));
        return;
    }

    const providedPwd = crypto.createHash("sha256").update(req.body.pwd).digest("hex");

    if(usuario.pwd !== providedPwd) {
        res.status(401);
        res.send(JSON.stringify({error: "Wrong password"}));
        return;
    }

    let rnd = crypto.randomInt(4000000000).toString();
    let sessionId = crypto.createHash("sha256").update(rnd).digest("hex");
    loggedUsers.push(sessionId);

    res.status(200);
    res.send(sessionId);
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
    if(!req.headers.authorization) {
        return res.status(403).json({error: "No credentials sent"});
    }

    if(typeof loggedUsers.find((i) => i == req.headers.authorization) === "undefined") {
        return res.status(401).json({error: "User is not logged in"});
    }

    next();
})

app.get("/perfil/:name", async (req, res) => {
    const perfil = await DB.getPerfilByUser(req.params.name);
    res.status(200).json(perfil);
})

app.post("/perfil", async (req, res) => {
    const result = await DB.insertPerfil(req.body.username, req.body.perfil);
    res.status(200).send("OK");
})

app.listen(8080, 'localhost', () => {
    console.log("listening on port 8080");
})