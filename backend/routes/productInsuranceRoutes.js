import express from 'express';

import { loginInsuranceAccount } from '../controllers/productInsuranceController.js';



const router = express.Router();
router.post('/login', loginInsuranceAccount);


export default router;
