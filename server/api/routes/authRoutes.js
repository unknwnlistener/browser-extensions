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


module.exports = router;