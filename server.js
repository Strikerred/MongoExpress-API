var express = require("express")
var path = require("path")
var bodyParser = require("body-parser")

var index = require("./routes/index")
var products = require("./routes/products")

var config = require('./config')

var app = express()

// var swaggerUI = require('swagger-ui-express') //sebastian
// var specs = require('./swagger.json') //sebastian

// View engine
var ejsEngine = require("ejs-locals");
app.engine("ejs", ejsEngine);           // support master pages
app.set("view engine", "ejs");          // ejs view engine

// Set static folder
app.use(express.static(path.join(__dirname, "client")));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//-------------------------------------------------Tutorial
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerDefinition = {
    info: {
        description: 'Products API swagger doc',
        swagger: '2.0',
        title: 'Inventory API',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
};
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
  };
var swaggerSpec = swaggerJSDoc(options);

//-----------------------------------------------End of Tutorial

// enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 


// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
app.use("/", index);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); //Tutorial
//app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs)) //Sebastian
app.use("/api", products);

app.listen(config.port, function() {
    console.log("Server started on port " + config.port)
});
