import express from 'express';

import { editProfile } from '../controller/user';

import { bodyKeys } from '../middleware/security';
import { auth } from '../middleware/auth';

const router = express.Router();

router.patch(
    '/',
    auth,
    bodyKeys([
        { key: 'currentPassword', type: 'string' },
        { key: 'newEmail', type: 'string' },
        { key: 'newPassword', type: 'string' },
    ]),
    editProfile,
);

export default router;