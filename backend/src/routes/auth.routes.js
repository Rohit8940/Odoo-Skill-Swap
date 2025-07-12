import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/auth.controller.js';

export default Router()
  .post(
    '/register',
    [
      body('name').notEmpty().withMessage('Name required'),
      body('email').isEmail().withMessage('Valid email required'),
      body('password').isLength({ min: 6 }).withMessage('Min 6 chars'),
    ],
    register
  )
  .post('/login', login);
