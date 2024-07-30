import express from 'express';
import jwt from 'jsonwebtoken'; 
import agentes from './data/agentes.js';
import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
// Publicar la carpeta public
app.use(express.static("public"));

//middlewares generales
app.use(express.json());

app.listen(3000, () => {
    console.log("Estamos up 3000")
})

app.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/index.html"));
});


app.post("/api/v1/login", (req, res) => {

    try {
        let {email, password} = req.body;



        let agente = agentes.find(agent => agent.email == email && agent.password == password);

        if(!agente){
            return res.status(400).json({
                message: "Las credenciales de acceso no coinciden con nuestra base de datos."
            })
        }

        agente = JSON.parse(JSON.stringify(agente));

        delete agente.password;

        let token = jwt.sign(agente, "random");

        res.json({
            message: "Login exitoso",
            agente, 
            token
        })


    } catch (error) {
        res.status(500).json({
            message: "Errror en el proceso de login"
        })
    }
});

app.get("/privada", (req, res) =>{
    try {
        let { token } = req.query;
        
        jwt.verify(token, 'random');

        res.sendFile(path.resolve(__dirname, "./privada.html"));
    } catch (error) {
        let status = 500;
        let message = "Error al cargar la vista.";
        console.log(error.message);
        if(error.message == "jwt must be provided"){
            status = 400;
            message = "Debe proporcionar un token válido para esta sección de la app."
        }else if(error.message == "invalid signature"){
            status = 401;
            message = "Debe proporcionar un token válido, intente haciendo nuevamente un login."
        }
        res.status(status).json(message);
    }
});

app.get("/restringida", (req, res) =>{
    try {
        let { token } = req.query;
        
        jwt.verify(token, 'random');

        res.sendFile(path.resolve(__dirname, "./restringida.html"));
    } catch (error) {
        let status = 500;
        let message = "Error al cargar la vista.";
        console.log(error.message);
        if(error.message == "jwt must be provided"){
            status = 400;
            message = "Debe proporcionar un token válido para esta sección de la app."
        }else if(error.message == "invalid signature"){
            status = 401;
            message = "Debe proporcionar un token válido, intente haciendo nuevamente un login."
        }
        res.status(status).json(message);
    }
});

