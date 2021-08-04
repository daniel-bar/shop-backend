import express from 'express';

import { IServerResponse } from '../../shared/response';

type ISavePaymentResponse = express.Response<IServerResponse>;

type IGetPaymentsResponse = express.Response<
    IServerResponse & {
        data?: {
            id: string;
            paymentDigits: string;
        }[];
    }
>;

type ICheckoutWithExistingPaymentResponse = express.Response<IServerResponse>;

type ICheckoutWithNewPaymentResponse = express.Response<IServerResponse>;

export {
    ISavePaymentResponse,
    IGetPaymentsResponse,
    ICheckoutWithExistingPaymentResponse,
    ICheckoutWithNewPaymentResponse,
};