'use strict';
module.exports = (app) => {
    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerUI = require('swagger-ui-express');

    // swagger definition
    var swaggerDefinition = {
        info: {
            title: 'Personalisation Bias Swagger API',
            version: '1.0.0',
            description: 'Tool for recording user data to quantify browser behaviour',
        },
        basePath: '/api',
    };
    
    // options for the swagger docs
    var options = {
        // import swaggerDefinitions
        swaggerDefinition: swaggerDefinition,
        // path to the API docs
        apis: ['./api/routes/*.js'],
    };
    
    // initialize swagger-jsdoc
    var swaggerSpec = swaggerJSDoc(options);

    // serve swagger
    app.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}