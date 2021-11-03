const express = require('express');
const app = express();

//const { } = require('./bd/coneccion.js');
//const send = require('./correo.js');

const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const secretKey = 'shhhh';


app.listen(3000, () => console.log('Servidor encendido en el puerto 3000'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
})
);

app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))

app.engine(
    "handlebars",
    exphbs({
        layoutsDir: __dirname + "/views",
        partialsDir: __dirname + "/views/componentes/",

    })
);
app.set("view engine", "handlebars");


app.get("/", (req, res) => {
    res.render("index");
});



app.get("/datos", function (req, res) {
    res.render("Datos");
});

app.get("/registro", function (req, res) {
    res.render("Registro");
});