import express from 'express';

import { loginInsuranceAccount } from '../controllers/productInsuranceController';



const router = express.Router();
router.post('/login', loginInsuranceAccount);


export default router;
