import mongoose from 'mongoose';

import ServerGlobal from '../server-global';

import {
    IPayment,
    IPaymentDocument,
    PaymentDB,
} from '../model/payment';

import {
    IGetPaymentsRequest,
    ISavePaymentRequest,
    ICheckoutWithExistingPaymentRequest,
    ICheckoutWithNewPaymentRequest,
} from '../model/express/request/payment';
import {
    ISavePaymentResponse,
    IGetPaymentsResponse,
    ICheckoutWithExistingPaymentResponse,
    ICheckoutWithNewPaymentResponse,
} from '../model/express/response/payment';

const getPayments = async (req: IGetPaymentsRequest, res: IGetPaymentsResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<getPayments>: Start processing request for user id ${req.userId!}`
    );

    try {
        type payment = Pick<IPayment, 'id' | 'cardNumber'>;

        const payments: ReadonlyArray<payment> = await PaymentDB.aggregate<payment>([
            {
                $match: { owner: req.userId! }
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: { cardNumber: 1 },
            },
        ]);

        ServerGlobal.getInstance().logger.info(
            `<getPayments>: Successfully got the payments for user with id ${req.userId!}`
        );

        res.status(200).send({
            success: true,
            message: 'Successfully retrieved payments',
            data: payments.map((payment) => ({
                id: payment.id.toHexString(),
                paymentDigits: payment.cardNumber.slice(payment.cardNumber.length - 5),
            })),
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<getPayments>: Failed to get the payments for user id ${req.userId!} \
because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const savePayment = async (req: ISavePaymentRequest, res: ISavePaymentResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<savePayment>: Start processing request with user id: ${req.userId!}`
    );

    // Validate client provided details
    if (req.body.fullname.length < 3 ||
        req.body.fullname.length > 26 ||
        req.body.cardNumber.length < 13 ||
        req.body.cardNumber.length > 19 ||
        req.body.nameOnCard.length > 26 ||
        req.body.cvv.length !== 3
    ) {
        ServerGlobal.getInstance().logger.error(
            `<savePayment>: Failed because provided payment details are invalid \
with user id ${req.userId!}`
        );

        res.status(400).send({
            success: false,
            message: 'Please provide valid details',
        });
        return;
    }

    try {
        // Creating the payment document
        const newPaymentDetails = new PaymentDB({
            owner: req.userId!,
            fullname: req.body.fullname,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            cardNumber: req.body.cardNumber,
            expiryDateMonth: req.body.expiryDateMonth,
            expiryDateYear: req.body.expiryDateYear,
            nameOnCard: req.body.nameOnCard,
            cvv: req.body.cvv,
        });

        // Saving the user document in DB
        await newPaymentDetails.save();

        ServerGlobal.getInstance().logger.info(
            `<savePayment>: Successfully saved payment with ID: ${newPaymentDetails.id} \
for user id: ${req.userId!}`
        );

        res.status(201).send({
            success: true,
            message: 'Successfully saved new payment',
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<savePayment>: Failed to save payment for user id ${req.userId!} \
because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const checkoutWithExistingPayment = async (req: ICheckoutWithExistingPaymentRequest, res: ICheckoutWithExistingPaymentResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<checkout/existing>: Start processing request for user id: ${req.userId!}`
    );

    try {
        const payment: Readonly<mongoose.Document> | null = await PaymentDB.findById(req.body.paymentId);

        if (!payment) {
            ServerGlobal.getInstance().logger.error(
                `<checkout/existing>: Failed to checkout because could not find payment with id ${req.body.paymentId} \
for user id ${req.userId!}`
            );

            res.status(400).send({
                success: false,
                message: 'Could not find payment for provided payment id',
            });
            return;
        }

        // Processing payment 
        ServerGlobal.getInstance().logger.info(
            `<checkout/existing>: Successfully checked out with payment id ${req.body.paymentId} \
for user id: ${req.userId!}`
        );

        res.status(201).send({
            success: true,
            message: 'Successfully checked out',
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<checkout/existing>: Failed to checkout for user id ${req.userId!} \
because of server error: ${e}`);

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const checkoutWithNewPayment = async (req: ICheckoutWithNewPaymentRequest, res: ICheckoutWithNewPaymentResponse) => {
    ServerGlobal.getInstance().logger.info(
        `<checkout/new>: Start processing request with user id: ${req.userId!}`
    );

    try {
        // Validate client provided details
        if (req.body.fullname.length < 3 ||
            req.body.fullname.length > 26 ||
            req.body.cardNumber.length < 13 ||
            req.body.cardNumber.length > 19 ||
            req.body.nameOnCard.length > 26 ||
            req.body.cvv.length !== 3
        ) {
            ServerGlobal.getInstance().logger.error(
                `<checkout/new>: Failed because provided payment details are invalid \
with user id ${req.userId!}`
            );

            res.status(400).send({
                success: false,
                message: 'Please provide valid details',
            });
            return;
        }

        let savedPayment = false;

        if (req.body.save) {
            savedPayment = true;

            // Create new payment document to store
            const newPayment = new PaymentDB({
                owner: req.userId!,
                fullname: req.body.fullname,
                address: req.body.address,
                country: req.body.country,
                city: req.body.city,
                cardNumber: req.body.cardNumber,
                expiryDateMonth: req.body.expiryDateMonth,
                expiryDateYear: req.body.expiryDateYear,
                nameOnCard: req.body.nameOnCard,
                cvv: req.body.cvv,
            });

            // Storing the user document in DB
            await newPayment.save();

            ServerGlobal.getInstance().logger.info(
                `<checkout/new>: Successfully saved payment with ID: ${newPayment.id} \
for user id: ${req.userId!}`
            );
        }

        // Processing payment 
        ServerGlobal.getInstance().logger.info(
            `<checkout/new>: Successfully checked out with id: ${req.userId!}. \
Client chose${savedPayment ? '' : ' not'} to save the payment.`
        );

        res.status(201).send({
            success: true,
            message: 'Successfully checked out',
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<checkout>: Failed to checkout with user id ${req.userId!} because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

export {
    getPayments,
    savePayment,
    checkoutWithExistingPayment,
    checkoutWithNewPayment,
}