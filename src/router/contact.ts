import express from 'express';

import { contact } from '../controller/contact';

import { bodyKeys } from '../middleware/security';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post(
    '/',
    auth,
    bodyKeys([{ key: 'message', type: 'string' }]),
    contact,
);

export default router;