import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  createSwap,
  mySwaps,
  updateStatus,
} from '../controllers/swap.controller.js';

const router = Router();

router.use(protect);             
router.post('/', createSwap);    
router.get('/my', mySwaps);      
router.patch('/:id/status', updateStatus);

export default router;
