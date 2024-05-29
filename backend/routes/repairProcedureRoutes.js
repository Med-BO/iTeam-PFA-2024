import express from 'express';

import {
    updateRepairStatus,
    getAllRepairProcedures
} from '../controllers/repairProcedureController.js';

const router = express.Router();


router.get('/all', getAllRepairProcedures);
router.put('/:id/update_status', updateRepairStatus)

export default router;
