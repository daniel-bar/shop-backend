import express from 'express';

import { bodyKeys } from '../middleware/security';
import { auth } from '../middleware/auth';

import {
    contact,
    getTopics,
} from '../controller/contact';

const router = express.Router();

router.post(
    '/',
    auth,
    bodyKeys([
        { key: 'topic', type: 'number' },
        { key: 'message', type: 'string' },
    ]),
    contact,
);

router.get(
    '/topics',
    auth,
    getTopics,
);

export default router;