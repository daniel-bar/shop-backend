import express from 'express';

import { ProductCategory } from '../../../server-global';

interface IAddProductRequest extends express.Request {
    readonly body: Readonly<{
        category: ProductCategory;
        title: string;
        description: string;
        price: number;
    }>;
}

interface IGetProductsRequest extends express.Request { }

interface IGetProductRequest extends express.Request {
    readonly params: Readonly<{ id: string; }>;
}

interface IGetCategoriesRequest extends express.Request { }

export {
    IAddProductRequest,
    IGetProductsRequest,
    IGetProductRequest,
    IGetCategoriesRequest,
};