import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { validatePagination, validateDateRange } from '../middleware/validation.js';
import {
  getUserSubscriptions,
  getSubscriptionById,
} from '../controllers/subscription.controller.js';

const router = Router();

router.get('/', requireAuth, validatePagination, validateDateRange, getUserSubscriptions);
router.get('/:id', requireAuth, getSubscriptionById);

export default router;
