const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const usuarios = [
    {
        name: "haggerty",
        pwd: "2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881"
    }
]

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

app.listen(8080, 'localhost', () => {
    console.log("listening on port 8080");
})