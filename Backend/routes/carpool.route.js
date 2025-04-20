import express from 'express';
import { body, query } from 'express-validator';
import { authUser } from '../middlewares/auth.middleware.js';
import { 
    findMatchingCarpoolsController, 
    joinCarpoolController,
    getCarpoolDetails
} from '../controllers/carpool.controller.js';

const router = express.Router();

router.get('/find',
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    findMatchingCarpoolsController
);

router.post('/join',
    authUser,
    body('carpoolId').isMongoId().withMessage('Invalid carpool id'),
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    joinCarpoolController
);

router.get('/:carpoolId',
    authUser,
    getCarpoolDetails
);

router.post('/:carpoolId/generate-otp',
    authUser,
    generatePassengerOTPController
);

router.post('/:carpoolId/verify-otp',
    authUser,
    body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    verifyPassengerOTPController
);

export default router;