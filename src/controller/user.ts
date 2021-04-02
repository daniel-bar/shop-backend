import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import ServerGlobal from '../server-global';

import {
    IUserDocument,
    UserDB,
} from '../model/user';

import {
    IEditProfileRequest,
} from '../model/express/request/user';
import {
    IEditProfileResponse,
} from '../model/express/response/user';

const editProfile = async (req: IEditProfileRequest, res: IEditProfileResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<editProfile>: Start processing request with user id ${req.userId!}`
    );

    // Check whether provided fields are valid
    if (
        (req.body.newPassword.length < 7 && req.body.newPassword.length > 0) ||
        req.body.newPassword.length > 24
    ) {
        res.status(400).send({
            success: false,
            message: 'Invalid form fields',
        });
        return;
    }

    try {
        // Find the user
        const userByID: Pick<
            IUserDocument, keyof mongoose.Document | 'id' | 'email' | 'password'
        > | null = await UserDB.findById(req.userId!, { password: 1 });

        if (!userByID) {
            ServerGlobal.getInstance().logger.error(
                `<editProfile>: Failed to get user details for user id ${req.userId!}`
            );

            res.status(401).send({
                success: false,
                message: 'Could not find user'
            });
            return;
        }

        // Check whether provided current password is correct
        const compareResult = await bcrypt.compare(req.body.currentPassword, userByID.password);

        if (!compareResult) {
            ServerGlobal.getInstance().logger.error(
                `<editProfile>: Failed to edit profile because \
provided password mismatches for user id ${req.userId!}`
            );

            res.status(400).send({
                success: false,
                message: 'Mismatch password',
            });
            return;
        }

        // Update user's email if client wants to
        if (req.body.newEmail !== '') {
            userByID.email = req.body.newEmail;
        }

        // Update user's password if client wants to
        if (req.body.newPassword !== '') {
            const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 8);

            userByID.password = hashedNewPassword;
        }

        await userByID.save();

        ServerGlobal.getInstance().logger.info(
            `<editProfile>: Successfully edited user profile with id ${userByID}`
        );

        res.status(200).send({
            success: true,
            message: 'Successfully edited user details',
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<editProfile>: Failed to edit profile because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

export { editProfile }
