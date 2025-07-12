// src/routes/user.routes.js
import { Router } from 'express';
import {
  getPublicUsers,
  getPublicProfile,
  updateMe
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';


const router = Router();


router.get('/', getPublicUsers);    
router.get('/:id', getPublicProfile);   
router.patch('/me', protect, updateMe);


export default router;
