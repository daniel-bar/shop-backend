import mongoose from 'mongoose';

import ServerGlobal, {
    ProductGender,
    ProductCategory,
} from '../server-global';

import { IDBCollection } from './shared/db-collection';

interface IProduct extends IDBCollection {
    readonly category: ProductCategory;
    readonly gender: ProductGender;
    readonly title: string;
    readonly description: string;
    readonly price: number;
    readonly imageFileName: string;
}

interface IProductDocument extends Omit<IProduct, 'id'>, mongoose.Document { }

interface IProductModel extends mongoose.Model<IProductDocument> { }

const productSchema: mongoose.Schema = new mongoose.Schema({
    category: {
        type: Number,
        enum: ServerGlobal.getInstance().productCategoriesValues,
        required: true,
    },
    gender: {
        type: Number,
        enum: ServerGlobal.getInstance().productGendersValues,
        required: true,
    },
    title: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
    description: {
        type: String,
        minlength: 3,
        maxlength: 350,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageFileName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const ProductDB = mongoose.model<IProductDocument, IProductModel>('Product', productSchema);

export {
    IProduct,
    IProductDocument,
    ProductDB,
};