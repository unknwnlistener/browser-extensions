'use strict';
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

  
  // todoList Routes
router.get('/actions',actionController.list_all_actions)
router.post('/actions',actionController.create_new_action);


module.exports = router;