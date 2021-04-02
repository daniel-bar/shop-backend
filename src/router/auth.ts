import express from 'express';

import {
    register,
    login,
    autoLogin,
} from '../controller/auth';

import {
    bodyKeys,
} from '../middleware/security';

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
    '/auto-login',
    autoLogin,
);

export default router;