import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import ServerGlobal from '../server-global';

import {
    IUserDocument,
    UserDB,
} from '../model/user';

import {
    IRegisterRequest,
    ILoginRequest,
    IAutoLoginRequest,
} from '../model/express/request/auth';
import {
    IRegisterResponse,
    ILoginResponse,
    IAutoLoginResponse,
} from '../model/express/response/auth';

const register = async (req: IRegisterRequest, res: IRegisterResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<register>: Start processing request with email: ${req.body.email}`
    );

    const isEmailValid = (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/).test(req.body.email);

    if (!isEmailValid) {
        ServerGlobal.getInstance().logger.error(
            '<register>: Failed to register since provided email is invalid'
        );

        res.status(400).send({
            success: false,
            message: 'Please provide valid email',
        });
        return;
    }

    // Validate client provided password of valid length
    if (req.body.password.length < 7 || req.body.password.length > 24) {
        ServerGlobal.getInstance().logger.error(
            '<register>: Failed to register since provided password is of invalid length'
        );

        res.status(400).send({
            success: false,
            message: 'Please provide password of at-least 7 and at most 24 characters length',
        });
        return;
    }

    try {
        // Find a document with the provided email
        const matchingUser: Readonly<Omit<
            mongoose.Document, 'id'
        >> | null = await UserDB.findOne({ email: req.body.email }, { id: 0 });

        if (matchingUser) {
            ServerGlobal.getInstance().logger.error(
                `<register>: Failed to register because provided email: ${req.body.email} is already exist`
            );

            res.status(400).send({
                success: false,
                message: 'Registration failed - provided email is already exist'
            });
            return;
        }

        // From now on, the client is allowed to register
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        // Creating the user document
        const newUser: IUserDocument = new UserDB({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashedPassword,
        });
        const newToken = jwt.sign({ id: newUser.id }, process.env.JWT_PWD, { expiresIn: '7 days' });

        // Insert to client`s token
        newUser.tokens = [{ token: newToken }];

        // Saving the user document in DB
        await newUser.save();

        ServerGlobal.getInstance().logger.info(
            `<register>: Successfully registered user with ID: ${newUser.id}`
        );

        res.status(201).send({
            success: true,
            message: 'Successfully created a new user',
            data: {
                fullname: req.body.fullname,
                email: req.body.email,
                token: newToken,
            },
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<register>: Failed to register because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const login = async (req: ILoginRequest, res: ILoginResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<login>: Start processing request with email: ${req.body.email}`
    );

    // Find matching user by email address
    try {
        const userByEmail: Omit<IUserDocument, 'email'> | null = await UserDB.findOne({ email: req.body.email }, {
            fullname: 1,
            password: 1,
            tokens: 1,
        });

        // There is no such user with the provided email
        if (!userByEmail) {
            ServerGlobal.getInstance().logger.error(
                `<login>: Failed to login because the email ${req.body.email} does not match any user`
            );

            res.status(400).send({
                success: false,
                message: 'Authentication failed',
            });
            return;
        }

        const compareResult = await bcrypt.compare(req.body.password, userByEmail.password);

        // Check whether the provided password is as same as the stored hashed one
        if (!compareResult) {
            ServerGlobal.getInstance().logger.error(
                '<login>: Failed to login because the password does not match the hashed password'
            );

            res.status(400).send({
                success: false,
                message: 'Authentication failed',
            });
            return;
        }

        // Create new token to insert
        const newToken = jwt.sign(
            { id: userByEmail.id },
            process.env.JWT_PWD,
            { expiresIn: '7 days' },
        );

        if (userByEmail.tokens.length === 5) {
            userByEmail.tokens.pop();
        }

        userByEmail.tokens = [{ token: newToken }, ...userByEmail.tokens];

        // Saving the user document in DB
        await userByEmail.save();

        ServerGlobal.getInstance().logger.info(
            `<login>: Successfully logged user in \
with email: ${req.body.email} to user id: ${userByEmail.id}`
        );

        res.status(200).send({
            success: true,
            message: 'Successfully authenticated',
            data: {
                fullname: userByEmail.fullname,
                email: req.body.email,
                token: newToken,
            },
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<register>: Failed to login because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const autoLogin = async (req: IAutoLoginRequest, res: IAutoLoginResponse) => {
    ServerGlobal.getInstance().logger.info('<autoLogin>: Start processing request');

    interface IVerify {
        readonly id: string;
        readonly iat: number;
        readonly exp: number;
    }

    let user: Pick<IUserDocument, 'fullname' | 'email'> | null;
    let userId: string;

    // Authorizing the user
    try {
        const token: string = (req.header('Authorization') as string).replace('Bearer ', '');
        const data: IVerify = jwt.verify(token, process.env.JWT_PWD) as IVerify;

        user = await UserDB.findById(data.id, { fullname: 1, email: 1 });

        if (!user) {
            ServerGlobal.getInstance().logger.error(
                `<autoLogin>: Failed to auto login with user id of ${data.id}`
            );

            res.status(401).send({
                success: false,
                message: 'Unable to auto login',
            });
            return;
        }

        userId = data.id;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<autoLogin>: Failed to auto login because of login error: ${e}`
        );

        res.status(401).send({
            success: false,
            message: 'Unable to auto login',
        });
        return;
    }

    ServerGlobal.getInstance().logger.info(
        `<autoLogin>: Successfully auto login user with id ${userId}`
    );

    res.status(200).send({
        success: true,
        message: 'Successful auto login',
        data: {
            fullname: user.fullname,
            email: user.email,
        }
    });
    return;
}

export {
    register,
    login,
    autoLogin,
}