import { IAuthenticatedRequest } from './auth';

import {
    PaymentMonth,
    PaymentYear,
} from '../../payment';

interface IGetPaymentsRequest extends IAuthenticatedRequest { }

interface ISavePaymentRequest extends IAuthenticatedRequest {
    readonly body: Readonly<{
        fullname: string;
        address: string;
        country: string;
        city: string;
        cardNumber: string;
        expiryDateMonth: PaymentMonth;
        expiryDateYear: PaymentYear;
        nameOnCard: string;
        cvv: string;
    }>;
}

interface ICheckoutWithExistingPaymentRequest extends IAuthenticatedRequest {
    readonly body: Readonly<{
        products: Readonly<{
            id: string;
            size: 'XS' | 'S' | 'M' | 'L' | 'XL';
        }>;
        paymentId: string;
    }>;
}

interface ICheckoutWithNewPaymentRequest extends IAuthenticatedRequest {
    readonly body: Readonly<{
        save: boolean;
        fullname: string;
        address: string;
        country: string;
        city: string;
        cardNumber: string;
        expiryDateMonth: PaymentMonth;
        expiryDateYear: PaymentYear;
        nameOnCard: string;
        cvv: string;
    }>;
}

export {
    IGetPaymentsRequest,
    ISavePaymentRequest,
    ICheckoutWithExistingPaymentRequest,
    ICheckoutWithNewPaymentRequest,
}