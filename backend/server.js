// Use Express
var express = require("express");
// Use body-parser
var bodyParser = require("body-parser");
var cors = require("cors");
var session = require('express-session');

// Create new instance of the express server
var app = express();

app.use(session({
    secret: 'sobambalauea',
    resave:true,
    saveUninitialized: false
}));

// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json());
// TODO ver si esto es necesario para asociar permisos.
app.use(bodyParser.urlencoded({ extended: true }));

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

var corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));

app.use((req,res,next) => {
    if(!req.session.usuarioID && ![
        '/api/usuarios'
        ,'/api/usuarios/ingresar'
        ,'/api/usuarios/salir'
        // ,'/api/permisos'
    ].includes(req.path))
        res.status(401).send('Inicie sesión.');
    else{
        next();
    }
})

app.use('/api',require('./rutas/todas'))

// Init the server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
/*app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});*/
