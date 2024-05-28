import express from 'express';

import {
    BuyProduct
} from '../controllers/productBuyController.js';

const router = express.Router();


router.post('/buy', BuyProduct);


export default router;
