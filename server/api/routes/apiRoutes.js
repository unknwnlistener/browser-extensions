'use strict';
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

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
 *     security:
 *       - Bearer: []
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
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Actions
 *     description: Creates a new action for current user
 *     consumes:
 *       - application/json
 *     parameters:
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
router.get('/users/actions', authController.verifyToken, actionController.list_all_actions);
router.post('/users/actions', authController.verifyToken, actionController.create_new_action); 

// All user actions for a single user
/**
 * @swagger
 * /users/{id}/actions:
 *   get:
 *     security:
 *       - Bearer: []
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
 */
router.get('/users/:userId/actions', authController.verifyToken, actionController.list_user_actions);


// User Routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: List of all users
 *     security:
 *       - Bearer: []
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
 *     deprecated: true
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
router.get('/users', authController.verifyToken, userController.list_all_users);
// router.post('/users', authController.verifyToken, userController.create_new_user);

module.exports = router;