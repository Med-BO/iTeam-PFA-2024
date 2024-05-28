import express from 'express';

import { loginInsuranceAccount, getUserContracts } from '../controllers/productInsuranceController.js';



const router = express.Router();
router.post('/login', loginInsuranceAccount);
router.get('/user/:userId/contracts', getUserContracts);


export default router;
