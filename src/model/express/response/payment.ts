import express from 'express';

import { FeedbackResponse } from '../../shared/response';

type ISavePaymentResponse = express.Response<FeedbackResponse>;

type IGetPaymentsResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: ReadonlyArray<Readonly<{
            id: string;
            paymentDigits: string;
        }>>;
    }>>
>;

type ICheckoutWithExistingPaymentResponse = express.Response<FeedbackResponse>;

type ICheckoutWithNewPaymentResponse = express.Response<FeedbackResponse>;

export {
    ISavePaymentResponse,
    IGetPaymentsResponse,
    ICheckoutWithExistingPaymentResponse,
    ICheckoutWithNewPaymentResponse,
}