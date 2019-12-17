var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  // Task = require('./api/models/todoListModel').default, //created model loading here
  bodyParser = require('body-parser');

require('./api/models/extensionModel').default;
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/chromeExtensions', function(error) {
  if(error)
    throw error;
  console.log("Connected successfully");
}); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/extensionRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Chrome Extension RESTful API server started on: ' + port);

// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });
