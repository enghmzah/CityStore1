import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from '../controllers/productController.js';

import { protect, authorize }from '../middleware/auth.js';
 

const router = express.Router();

router.route('/featured').get(getFeaturedProducts);
router.route('/').get(getProducts).post(protect, authorize('admin'), createProduct);
router.route('/:id').get(getProduct).put(protect, authorize('admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct);

export default router;

