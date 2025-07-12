import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  createSwap,
  mySwaps,
  updateStatus,
} from '../controllers/swap.controller.js';

const router = Router();

router.use(protect);             // all below require JWT
router.post('/', createSwap);    // Screen 4 → “Request” button
router.get('/my', mySwaps);      // Screen 6 → list
router.patch('/:id/status', updateStatus);

export default router;
