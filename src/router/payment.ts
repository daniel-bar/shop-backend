import express from 'express';

import {
    savePayment,
    getPayments,
    checkoutWithExistingPayment,
    checkoutWithNewPayment,
} from '../controller/payment';

import { bodyKeys } from '../middleware/security';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post(
    '/',
    auth,
    bodyKeys([
        { key: 'fullname', type: 'string' },
        { key: 'address', type: 'string' },
        { key: 'country', type: 'string' },
        { key: 'city', type: 'string' },
        { key: 'cardNumber', type: 'string' },
        { key: 'expiryDateMonth', type: 'number' },
        { key: 'expiryDateYear', type: 'string' },
        { key: 'nameOnCard', type: 'string' },
        { key: 'cvv', type: 'string' },
    ]),
    savePayment,
);

router.get(
    '/all',
    auth,
    getPayments,
);

router.post(
    '/checkout/existing',
    auth,
    bodyKeys([{ key: 'paymentId', type: 'string' }]),
    checkoutWithExistingPayment,
);

router.post(
    '/checkout/new',
    auth,
    bodyKeys([
        { key: 'save', type: 'boolean' },
        { key: 'fullname', type: 'string' },
        { key: 'address', type: 'string' },
        { key: 'country', type: 'string' },
        { key: 'city', type: 'string' },
        { key: 'cardNumber', type: 'string' },
        { key: 'expiryDateMonth', type: 'number' },
        { key: 'expiryDateYear', type: 'string' },
        { key: 'nameOnCard', type: 'string' },
        { key: 'cvv', type: 'string' },
    ]),
    checkoutWithNewPayment,
);

export default router;