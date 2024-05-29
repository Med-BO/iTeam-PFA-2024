import express from 'express';

import {
    getClaimsByUser,
    createProductClaim
} from '../controllers/ProductClaimController.js';

const router = express.Router();


router.get('/user/:id', getClaimsByUser);
router.post('/productClaims', createProductClaim)

export default router;
