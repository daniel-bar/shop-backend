import express from 'express';
import multer from 'multer';

import { adminAuth } from '../middleware/auth';

import {
    storage,
    addProduct,
    getProducts,
    getProduct,
    getCategories,
    getGenders,
    deleteProduct,
} from '../controller/product';

const router = express.Router();

router.post(
    '/',
    adminAuth,
    multer({ storage }).single('image'),
    addProduct,
);

router.get(
    '/:category/:gender',
    getProducts,
);

router.get(
    '/categories',
    getCategories,
);

router.get(
    '/genders',
    getGenders,
);

router.get(
    '/:id',
    getProduct,
);

router.delete(
    '/:id',
    deleteProduct,
);

export default router;