import { IAuthenticatedRequest } from "./auth";

import { PaymentMonth, PaymentYear, PaymentSize } from "../../../server-global";

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
    products: ReadonlyArray<{
      id: string;
      size: PaymentSize;
    }>;
    paymentId: string;
  }>;
}

interface ICheckoutWithNewPaymentRequest extends IAuthenticatedRequest {
  readonly body: Readonly<{
    // products: ReadonlyArray<{
    //   id: string;
    //   size: PaymentSize;
    // }>;
    save: boolean;
    payment: Readonly<{
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
  }>;
}

export {
  IGetPaymentsRequest,
  ISavePaymentRequest,
  ICheckoutWithExistingPaymentRequest,
  ICheckoutWithNewPaymentRequest,
};
