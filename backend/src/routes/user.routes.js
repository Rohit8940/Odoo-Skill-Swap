// src/routes/user.routes.js
import { Router } from 'express';
import {
  getPublicUsers,
  getPublicProfile
} from '../controllers/user.controller.js';

const router = Router();

// Public access
router.get('/', getPublicUsers);         // GET /api/users?skill=...&availability=...
router.get('/:id', getPublicProfile);    // GET /api/users/:id

export default router;
