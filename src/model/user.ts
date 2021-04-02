import mongoose from 'mongoose';

import { IDBCollection } from './shared/db-collection';

interface IUser extends IDBCollection {
    readonly fullname: string;
    email: string;
    password: string;
    tokens: Readonly<{ _id?: mongoose.Types.ObjectId, token: string }>[];
}

interface IUserDocument extends Omit<IUser, 'id'>, mongoose.Document { }

interface IUserModel extends mongoose.Model<IUserDocument> { }

const userSchema: mongoose.Schema = new mongoose.Schema({
    fullname: {
        type: String,
        minlength: 3,
        maxlength: 26,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        maxlength: 320,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: {
        type: [{
            token: { type: String },
        }],
        default: [],
    },
}, {
    timestamps: true,
});

const UserDB = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export {
    IUserDocument,
    UserDB,
}