# browser-extensions
Testing Chrome extension projects

### Usage
Follow these steps to start node server:
* Go to root folder of project
* Run `node .\server.js` on the terminal
* Open `localhost:3000` in a browser

### Current Routes
* `/api/users/actions` 
    - `GET` call to retrieve all actions for all users
    - `POST` call to create a new action entry for current user

* `api/users/:id/actions`
    - `GET` call to retrieve all actions for a specific user id

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
- Storing Images: https://docs.mongodb.com/manual/reference/limits/#BSON%20Document%20Size

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

###### Express
- Async/Await - https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
    - In JS - https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9

###### REST APIs
- Best Practices - https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
- More Best practices - https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/
- What is - https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design#:~:text=REST%20is%20an%20architectural%20style%20for%20building%20distributed%20systems%20based%20on%20hypermedia.&text=For%20REST%20APIs%20built%20on,use%20a%20stateless%20request%20model.

###### Chrome extension
- Desktop Capture: https://developer.chrome.com/extensions/desktopCapture
- Keystroke Capture: https://dmauro.github.io/Keypress/
- KeyboardJS: https://robertwhurst.github.io/KeyboardJS/
- All key codes info: https://keycode.info/