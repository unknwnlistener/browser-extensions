const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./api/models/actionModel').default; //importing Model
require('./api/models/userModel').default; //importing Model

var port = process.env.PORT || 3000;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://cs20108admin:fkAFVJSWTWPOHSgg@cluster0-i4i3t.mongodb.net/webrecorder?retryWrites=true&w=majority', (err) => { //Change path to Atlas
    if(err) { console.log("UNSUCCESSFUL : ",err); }
}); 
console.log("DB Connected successfully");

var swagger = require('./swagger'); // configure swagger
swagger(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("../client/public"));

let auth = require('./api/routes/authRoutes');
app.use('/api', auth);

let api = require('./api/routes/apiRoutes'); //importing routes
app.use('/api', api); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

var server = app.listen(port, () => {
    let port = server.address().port;

    console.log('Chrome Extension RESTful API server started on: ' + port);
});


