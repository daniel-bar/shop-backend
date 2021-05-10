import mongoose from 'mongoose';

interface IDBCollection {
    readonly id: mongoose.Types.ObjectId;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export { IDBCollection }