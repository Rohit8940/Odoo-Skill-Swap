import { Router } from 'express';
import { getMe, updateMe } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/me', getMe);
router.put('/me', updateMe);

export default router;
