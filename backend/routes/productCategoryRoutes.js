import express from 'express';
import cors from 'cors';

import {
    addCategory,
    getAllProductCategories,
    updateProductCategory,
    deleteProductCategory
} from '../controllers/productCategoryController.js';

const router = express.Router();


router.post('/', addCategory);
router.get('/', getAllProductCategories, cors())
router.put('/:id', updateProductCategory)
router.delete('/:id', deleteProductCategory)

export default router;
