import express from 'express';

import {
    addProduct,
    getProducts,
    getProduct,
    getCategories,
    deleteProduct,
} from '../controller/product';

import { bodyKeys } from '../middleware/security';
import { adminAuth } from '../middleware/auth';

const router = express.Router();

router.post(
    '/',
    adminAuth,
    bodyKeys([
        { key: 'category', type: 'number' },
        { key: 'gender', type: 'string' },
        { key: 'title', type: 'string' },
        { key: 'description', type: 'string' },
        { key: 'price', type: 'number' },
        { key: 'image', type: 'string' },
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

router.delete(
    '/:id',
    deleteProduct,
);

export default router;