require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const cors = require('cors');
require('./server/api/models/actionModel').default; 
require('./server/api/models/userModel').default; 
require('./server/api/models/tokenModel').default; 

const connUri = process.env.DB_CONNECTION;
let port = process.env.PORT || 3000;

// CREATE APP
const app = express();
// app.use(cors());

// SET UP DATABASE
mongoose.Promise = global.Promise;
mongoose.connect(connUri, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if(err) { console.error("MongoDB -- Unsuccesful - could not connect : ",err); }
}); 
const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB --  database connection established successfully!'));
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// CONFIGURE SWAGGER
var swagger = require('./swagger'); 
swagger(app);

// PARSER SET UP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

// IMPORTING ROUTES
let api = require('./server/api/routes/apiRoutes'); 
app.use('/api', api); //register the route

let auth = require('./server/api/routes/authRoutes');
app.use('/api', auth);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

var server = app.listen(port, () => {
    let port = server.address().port;

    console.log('Chrome Extension RESTful API server started on: ' + port);
});


