import mongoose from 'mongoose';

import { IDBCollection } from './shared/db-collection';

enum PaymentMonth {
    January = 1,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}

enum PaymentYear {
    Y_2021 = '2021',
    Y_2022 = '2022',
    Y_2023 = '2023',
    Y_2024 = '2024',
    Y_2025 = '2025',
}

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

interface IPaymentDocument extends Omit<IPayment, 'id'>, mongoose.Document { }

interface IPaymentModel extends mongoose.Model<IPaymentDocument> { }

const paymentSchema: mongoose.Schema = new mongoose.Schema({
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
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        require: true,
    },
    expiryDateYear: {
        type: String,
        enum: ['2021', '2022', '2023', '2024', '2025'],
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
}, {
    timestamps: true,
});

const PaymentDB = mongoose.model<IPaymentDocument, IPaymentModel>('Payment', paymentSchema);

export {
    PaymentMonth,
    PaymentYear,
    IPayment,
    IPaymentDocument,
    PaymentDB,
}