import express from "express";
import cors from "cors";
import crypto from "crypto";
import DB from "./DB.js";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/login", async (req, res) => {
    let hash = crypto.createHash("sha256")
    const usuario = usuarios.find((usuario) => usuario.name === req.body.name);
    
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

    res.status(200);
    res.send("OK");
});

app.post("/registro", async (req, res) => {
    if (await DB.getUser(req.body.name) !== "error") { //chequear
        res.status(400); //Bad request
        res.send({error: "User already exists"});
        return;
    }

    let hash = crypto.createHash("sha256");

    hash.update(req.body.pwd);
    const hashedPwd = hash.digest("hex");

    const result = await DB.insertUser(req.body);

    res.status(201);
    res.send("Ok");
})

app.listen(8080, 'localhost', () => {
    console.log("listening on port 8080");
})