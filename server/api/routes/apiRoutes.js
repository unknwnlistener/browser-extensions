'use strict';
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

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


module.exports = router;