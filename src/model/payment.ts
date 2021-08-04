import mongoose from "mongoose";

import ServerGlobal, {
  PaymentMonth,
  PaymentYear,
  PaymentSize,
} from "../server-global";

import { IDBCollection } from "./shared/db-collection";

interface IPayment extends IDBCollection {
  readonly owner: mongoose.Types.ObjectId;
  readonly fullname: string;
  readonly address: string;
  readonly country: string;
  readonly city: string;
  readonly cardNumber: string;
  readonly expiryDateMonth: PaymentMonth;
  readonly expiryDateYear: PaymentYear;
  readonly nameOnCard: string;
  readonly cvv: string;
}

interface IPaymentDocument extends Omit<IPayment, "id">, mongoose.Document {}

interface IPaymentModel extends mongoose.Model<IPaymentDocument> {}

const paymentSchema: mongoose.Schema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    fullname: {
      type: String,
      minlength: 3,
      maxlength: 26,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      minlength: 13,
      maxlength: 19,
      unique: true,
      required: true,
    },
    expiryDateMonth: {
      type: Number,
      enum: ServerGlobal.getInstance().paymentMonthsValues,
      require: true,
    },
    expiryDateYear: {
      type: Number,
      enum: ServerGlobal.getInstance().paymentYearsValues,
      require: true,
    },
    nameOnCard: {
      type: String,
      maxlength: 26,
      require: true,
    },
    cvv: {
      type: String,
      minlength: 3,
      maxlength: 3,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentDB = mongoose.model<IPaymentDocument, IPaymentModel>(
  "Payment",
  paymentSchema
);

export {
  PaymentMonth,
  PaymentYear,
  PaymentSize,
  IPayment,
  IPaymentDocument,
  PaymentDB,
};
