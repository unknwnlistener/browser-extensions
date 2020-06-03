'use strict';
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const userController = require('../controllers/userController');

/**
 * @swagger
 * definitions:
 *   actions:
 *     properties:
 *       action:
 *         type: string
 *         enum: [url, mouse, key, tab_opened, tab_closed, tab_switch]
 *       tab:
 *         type: string
 *       url:
 *         type: string
 *       mouse_x:
 *         type: number
 *       mouse_y:
 *         type: number
 *       keys:
 *         type: string
 *   users:
 *     properties:
 *       name:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 */
  
// Action Routes
/**
 * @swagger
 * /users/actions:
 *   get:
 *     tags:
 *       - Actions
 *     description: Returns all actions for all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of actions
 *         schema:
 *           $ref: '#/definitions/actions'
 * 
 */
router.get('/users/actions',actionController.list_all_actions);

// All user actions for a single user
/**
 * @swagger
 * /users/{id}/actions:
 *   get:
 *     tags:
 *       - Actions
 *     description: Returns all actions for specific user
 *     parameters:
 *       - name: id
 *         required: true
 *         in: path
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of actions
 *         schema:
 *           $ref: '#/definitions/actions'
 *   post:
 *     tags:
 *       - Actions
 *     description: Creates a new action
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         required: true
 *         in: path
 *       - name: action
 *         description: actions are related based on their type
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/actions'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.get('/users/:userId/actions', actionController.list_user_actions);
router.post('/users/:userId/actions',actionController.create_new_action); 


// User Routes
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/users'
 * 
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Basic user information
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/users'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.get('/users',userController.list_all_users);
router.post('/users',userController.create_new_user);

module.exports = router;