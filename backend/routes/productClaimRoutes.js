import express from 'express';
import cors from 'cors';

import {
    getClaimsByUser,
} from '../controllers/ProductClaimController.js';

const router = express.Router();


router.get('/user/:id', getClaimsByUser);

export default router;
