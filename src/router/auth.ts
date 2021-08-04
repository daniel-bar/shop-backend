import express from 'express';

import { bodyKeys } from '../middleware/security';

import {
    register,
    login,
    autoLogin,
} from '../controller/auth';

const router = express.Router();

router.post(
    '/register',
    bodyKeys([
        { key: 'fullname', type: 'string' },
        { key: 'email', type: 'string' },
        { key: 'password', type: 'string' },
    ]),
    register,
);

router.post(
    '/login',
    bodyKeys([
        { key: 'email', type: 'string' },
        { key: 'password', type: 'string' },
    ]),
    login,
);

router.get(
    '/',
    autoLogin,
);

export default router;