import express from 'express';

import {
    addProduct,
    getProducts,
    getProduct,
    getCategories,
} from '../controller/product';

import { bodyKeys } from '../middleware/security';
import { adminAuth } from '../middleware/auth';

const router = express.Router();

router.post(
    '/',
    adminAuth,
    bodyKeys([
        { key: 'title', type: 'string' },
        { key: 'description', type: 'string' },
        { key: 'price', type: 'number' }
    ]),
    addProduct,
);

router.get(
    '/all',
    getProducts,
);

router.get(
    '/:id',
    getProduct,
);

router.get(
    '/categories',
    getCategories,
);

export default router;