'use strict';
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

/**
 * @swagger
 * definitions:
 *   actions:
 *     properties:
 *       user_id:
 *         type: integer
 *       action:
 *         type: string
 *       tab:
 *         type: string
 *       url:
 *         type: string
 *       mouse_x:
 *         type: string
 *       mouse_y:
 *         type: string
 *       keys:
 *         type: string
 */
  
// Action Routes
/**
 * @swagger
 * /api/actions:
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
 *   post:
 *     tags:
 *       - Actions
 *     description: Creates a new action
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: action
 *         description: actions are reated based on their type
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/actions'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.get('/actions',actionController.list_all_actions)
router.post('/actions',actionController.create_new_action);


module.exports = router;