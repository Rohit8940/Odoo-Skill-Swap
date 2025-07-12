import { Router } from 'express';
import {
  createSwap,
  getMySwaps,
  updateStatus,
} from '../controllers/swap.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.post('/', createSwap);
router.get('/my', getMySwaps);
router.patch('/:id/status', updateStatus);

export default router;
