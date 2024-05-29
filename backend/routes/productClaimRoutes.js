import express from 'express';

import {
    getClaimsByUser,
    createProductClaim,
    getAllClaims,
    updateClaimStatus
} from '../controllers/ProductClaimController.js';

const router = express.Router();


router.get('/user/:id', getClaimsByUser);
router.post('/productClaims', createProductClaim)
router.get('/claims', getAllClaims);
router.put("/:id/status", updateClaimStatus);

export default router;
