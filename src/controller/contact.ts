import nodemailer from 'nodemailer';

import ServerGlobal from '../server-global';

import {
    IContantRequest,
    IGetTopicsRequest,
} from '../model/express/request/contact';
import {
    IContantResponse,
    IGetTopicsResponse,
} from '../model/express/response/contact';

const contact = async (req: IContantRequest, res: IContantResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<contant>: Start processing request with user id: ${req.userId!}`
    );

    const topicLabel = ServerGlobal.getInstance().getContactTopicLabel(req.body.topic);

    if (!topicLabel) {
        ServerGlobal.getInstance().logger.error(
            `<contant>: Failed to send contact message of user with id ${req.userId!} \
becuase provided topic is invalid`);

        res.status(400).send({
            success: false,
            message: 'Please provide valid topic',
        });
        return;
    }

    // Validate client provided message of valid length
    if (req.body.message.length < 3 || req.body.message.length > 1000) {
        ServerGlobal.getInstance().logger.error(
            `<contant>: Failed to send contact message of user with id ${req.userId!} \
becuase provided message is of invalid length`);

        res.status(400).send({
            success: false,
            message: 'Please provide valid message',
        });
        return;
    }

    const transporter: nodemailer.Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: topicLabel,
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
        console.log(e)
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

const getTopics = async (req: IGetTopicsRequest, res: IGetTopicsResponse) => {
    ServerGlobal.getInstance().logger.info('<getTopics>: Start processing request');

    ServerGlobal.getInstance().logger.info('<getTopics>: Successfully processed request');

    res.status(200).send({
        success: true,
        message: 'Successfully retrieved topics',
        data: ServerGlobal.getInstance().contactTopics,
    });
    return;
}

export {
    contact,
    getTopics,
};