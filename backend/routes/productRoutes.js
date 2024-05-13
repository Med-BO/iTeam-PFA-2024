import express from 'express';
import cors from 'cors';

import {
    addProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    getOneProduct
} from '../controllers/productController.js';

const router = express.Router();


router.post('/', addProduct);
router.get('/', getAllProduct, cors())
router.get('/:id', getOneProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;
