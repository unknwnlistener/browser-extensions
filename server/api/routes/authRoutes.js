'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

/**
 * @swagger
 * definitions:
 *   UserCredentials:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string            
 *   User:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string   
 *       name:
 *         type: string        
 *   Config:
 *     properties:
 *       url:
 *         type: boolean
 *       tab_opened:
 *         type: boolean
 *       tab_closed:
 *         type: boolean
 *       mouse_click:
 *         type: boolean
 *       keystrokes:
 *         type: boolean
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authorizes a user and returns JWT
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: credentials
 *         required: true
 *         paramType: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/UserCredentials'   
 *     responses:
 *       200:
 *         description: Successfully authenticated
 */
router.post('/login', authController.login_user);

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registers a user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userDetails
 *         required: true
 *         paramType: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'   
 *     responses:
 *       200:
 *         description: Successfully registered
 */
router.post('/register', authController.register_user);


// Config Route
/**
 * @swagger
 * /config:
 *   get:
 *     summary: Gets the server config setting
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Config
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: JSON of config file
 *         schema:
 *           $ref: '#/definitions/Config'
 *   put:
 *     summary: Updates the server config setting
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Config
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: JSON of config file
 *         schema:
 *           $ref: '#/definitions/Config'
 */
router.get('/config', authController.verifyToken, authController.get_config);
router.put('/config', authController.verifyToken, authController.update_config);

module.exports = router;