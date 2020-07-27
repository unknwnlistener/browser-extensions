require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./server/api/models/actionModel').default; 
require('./server/api/models/userModel').default; 

const connUri = process.env.DB_CONNECTION;
let port = process.env.PORT || 3000;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(connUri, (err) => {
    if(err) { console.log("UNSUCCESSFUL : ",err); }
}); 
console.log("DB Connected successfully");

var swagger = require('./server/swagger'); // configure swagger
swagger(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./client/public"));

let auth = require('./server/api/routes/authRoutes');
app.use('/api', auth);

let api = require('./server/api/routes/apiRoutes'); //importing routes
app.use('/api', api); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

var server = app.listen(port, () => {
    let port = server.address().port;

    console.log('Chrome Extension RESTful API server started on: ' + port);
});


