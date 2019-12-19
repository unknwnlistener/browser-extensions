'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/extensionController');

  // todoList Routes
  app.route('/url')
    .get(todoList.list_all_sites)
    .post(todoList.create_new_sites);


//   app.route('/url/:urlId')
//     .get(todoList.read_a_site)
//     .put(todoList.update_a_site)
//     .delete(todoList.delete_a_site);
};
