const {connection} = require("./database/connection");
const express = require('express')
const cors = require('cors');
require('dotenv').config()


//Inicializar app
console.log("App arrancada")

//Conectar a la base de datos
connection();

//Crear servidor rest
const app = express();

//puerto variable de entorno o 3000
const puerto = process.env.PORT || 3000;


// Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json()); //recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true })); //recibiendo datos que vienen por form-urlencoded

//Rutas
const article_router = require("./routes/article");


//cargo las rutas
app.use("/api", article_router);





//rutas pruebas hardcodeadas
//Crear rutas
app.get("/probando", (req,res) =>{
    console.log('Se ha ejecutado el endpoint probando');
    return res.status(200).json([{
        curso: "Master en React",
        autor: "Kevin Escobar Martínez",
        url: "Url de prueba"
    },
    {
        curso: "Master en React",
        autor: "Kevin Escobar Martínez",
        url: "Url de prueba"
    }
    ]);
});


app.get("/", (req,res) =>{
    console.log('Se ha ejecutado el endpoint probando');
    return res.status(200).send(
        "<h1>Empezando a crear una api rest con node</h1>"
    );
});

//Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log('Servidor corriendo en el puerto '+puerto)

});


