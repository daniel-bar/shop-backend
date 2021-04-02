import nodemailer from 'nodemailer';

import ServerGlobal from '../server-global';

import { IContantRequest } from '../model/express/request/contact';
import { IHandleContantResponse } from '../model/express/response/contact';

const contact = async (req: IContantRequest, res: IHandleContantResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<contant>: Start processing request with user id: ${req.userId!!}`
    );

    // Validate client provided message of valid length
    if (req.body.message.length < 3 || req.body.message.length > 1000) {
        ServerGlobal.getInstance().logger.error(
            `<contant>: Failed to send contact message of user with id ${req.userId!!} \
becuase provided message is of invalid length`);

        res.status(400).send({
            success: false,
            message: 'Please provide message of at-least 3 and at most 1000 characters length',
        });
        return;
    }

    const transporter: nodemailer.Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mhfchelloworld@gmail.com',
            pass: '1379Daniel1379',
        },
    });

    try {
        await transporter.sendMail({
            from: 'mhfchelloworld@gmail.com',
            to: "mhfchelloworld@gmail.com",
            subject: "Welcome Email",
            text: req.body.message,
        });

        ServerGlobal.getInstance().logger.info(
            `<contact>: Successfully sent message from user with id ${req.userId!!}`
        );

        res.status(200).send({
            success: true,
            message: 'Successfully sent an email',
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<contant>: Failed to sent message with user id ${req.userId!!} because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

export { contact }
