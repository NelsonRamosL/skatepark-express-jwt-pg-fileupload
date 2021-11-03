const express = require('express');
const app = express();

const { nuevoSkater,getAuthSkater,getSkaters,skaterAuth,getSkatersId,eliminarSkater,editarSkater } = require('./bd/coneccion.js');
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





app.get('/', async (req, res) => {
    console.log("entramos en index")
    try {
        const skaters = await getSkaters();
        res.render('index', { skaters });
    } catch (e) {
        res.statusCode = 500;
        res.end("ocurrio un error en el servidor" + e);
    }
})








app.get("/datos", function (req, res) {
    res.render("Datos");
});

app.get("/registro", function (req, res) {
    res.render("Registro");
});

app.get("/login", function (req, res) {
    res.render("Login");
});



//  El sistema debe permitir registrar nuevos participantes.
app.post('/agregar', async (req, res) => {
    const { email,nombre,password,password2,anos,especialidad } = req.body;
    console.log( email,nombre,password,password2,anos,especialidad)
    
    // if (Object.keys(req.files).length == 0) {
    //     return res.status(400).send("No se encontro ningun archivo en la consulta");
    // }
    const { foto } = req.files;
    const { name } = foto;
        
console.log(foto,name)    
foto.mv(`${__dirname}/public/img/${name}`, async(err) => {
     if(err) return res.status(500).send({
         error: `algo salio mal .... ${err}`,
         code: 500
     })
    })
const values = {
    email,
    nombre,
    password,
    anos,
    especialidad,
    name
}


    try {
        const result = await nuevoSkater(values);
        res.statusCode = 201;
        res.redirect("/");
        //res.render('index');
        // res.end(JSON.stringify(result));

    } catch (e) {
        console.log("error" + e)
        res.statusCode = 500;
        res.end("ocurrio un error" + e);
    }


})


// Verificar en base de datos y crear token
app.post('/verify', async (req, res) => {
    const values = req.body;
    console.log(values);

    const result = await getAuthSkater(values);

    if (result) {
        if (result.estado) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 300,
                    data: result,
                },
                secretKey
            );

            //res.statusCode = 201;
            res.send(token);
        } else {
            res.status(401).send({
                error: " este usuario no tiene autorizacion, Contacte al Administrador",
                code: 401,
            });
        }



    } else {
        res.status(401).send({
            error: "este usuario no esta registrado",
            code: 401,
        });
    }
})



app.get('/Admin', async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.render('Admin', { skaters });
    } catch (e) {
        res.statusCode = 500;
        res.end("ocurrio un error en el servidor" + e);
    }
})



app.put('/skatersAuth', async (req, res) => {
    const values = req.body;
    console.log(values);
    try {
        const result = await skaterAuth(values);
        res.statusCode = 200;
        res.end(JSON.stringify(result));
    } catch (e) {
        res.statusCode = 500;
        res.end("ocurrio un error" + e);
    }
})




app.get('/editarSkater/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const skaters = await getSkatersId(id);
        res.render('Datos', { skaters });
    } catch (e) {
        res.statusCode = 500;
        res.end("ocurrio un error en el servidor" + e);
    }
})






app.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
try {
    const result = await eliminarSkater(id);
    res.statusCode = 201;
    res.end(JSON.stringify(result));
} catch (e) {
    console.log("error" + e)
    res.statusCode = 500;
    res.end("ocurrio un error" + e);
}

})






app.put('/modificarSkater', async (req, res) => {
    const values = req.body;
    console.log(values);
    try {
        const result = await editarSkater(values);
        res.statusCode = 200;
        res.end(JSON.stringify(result));
    } catch (e) {
        res.statusCode = 500;
        res.end("ocurrio un error" + e);
    }
})