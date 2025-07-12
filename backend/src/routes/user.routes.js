// src/routes/user.routes.js
import { Router } from 'express';
import {
  getPublicUsers,
  getPublicProfile,
  updateMe
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';


const router = Router();

// Public access
router.get('/', getPublicUsers);         // GET /api/users?skill=...&availability=...
router.get('/:id', getPublicProfile);    // GET /api/users/:id
router.patch('/me', protect, updateMe);


export default router;
