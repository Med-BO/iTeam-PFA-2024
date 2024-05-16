import express from 'express';

import {
    addProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    getOneProduct,
    getAllProductByCategoryName
} from '../controllers/productController.js';

const router = express.Router();


router.post('/', addProduct);
router.get('/', getAllProduct)
router.get('/:id', getOneProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/category/:categoryId', getAllProductByCategoryName)

export default router;
