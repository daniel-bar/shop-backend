import express from 'express';

import { ProductCategory } from '../../../server-global';

import { ProductGender } from '../../product';

interface IAddProductRequest extends express.Request {
    readonly body: Readonly<{
        category: ProductCategory;
        gender: ProductGender;
        title: string;
        description: string;
        price: number;
        image: string;
    }>;
}

interface IGetProductsRequest extends express.Request { }

interface IGetProductRequest extends express.Request {
    readonly params: Readonly<{ id: string; }>;
}

interface IGetCategoriesRequest extends express.Request { }

interface IDeleteProductRequest extends express.Request {
    readonly params: Readonly<{ id: string; }>;
}

interface IGetProductsSumRequest extends express.Request { }

export {
    IAddProductRequest,
    IGetProductsRequest,
    IGetProductRequest,
    IGetCategoriesRequest,
    IDeleteProductRequest,
    IGetProductsSumRequest,
}