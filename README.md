# browser-extensions
Testing Chrome extension projects

### Usage
Follow these steps to start node server:
* Go to root folder of project
* Run `node .\server\server.js` on the terminal
* Open `localhost:3000` in a browser

### Current Routes
* `/api/users/actions` 
    - `GET` call to retrieve all actions for all users

* `api/users/:id/actions`
    - `GET` call to retrieve all actions for a specific user id
    - `POST` call to create a new action entry

* `api/users`
    - `GET` call to retrieve all users in system [TODO] Add permissions to this call
    - `POST` call to create a new user

### Resources
###### Node.js
- https://nodejs.dev/differences-between-nodejs-and-the-browser
- https://www.codementor.io/@olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd

###### MongoDB
- https://university.mongodb.com/courses/M001/about?offering_id=M001%2F2019_December_10
- https://ciphertrick.com/connecting-mongodb-nodejs/

###### Mongoose
- https://code.tutsplus.com/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527
- https://mongoosejs.com/docs/guide.html#timestamps
- https://github.com/ramiel/mongoose-sequence

###### Swagger
- https://mherman.org/blog/swagger-and-nodejs/
- https://swagger.io/specification/


###### Sass
- https://htmlmag.com/article/an-introduction-to-css-preprocessors-sass-less-stylus
- https://sass-lang.com/guide

###### Material Design
- https://material.io/design/color/the-color-system.html#tools-for-picking-colors