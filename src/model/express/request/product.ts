import express from 'express';

interface IAddProductRequest extends express.Request {
    readonly body: Readonly<{
        category: string;
        gender: string;
        title: string;
        description: string;
        price: string;
    }>;
}

interface IGetProductsRequest extends express.Request {
    readonly params: Readonly<{
        category: string;
        gender: string;
    }>;
}

interface IGetProductRequest extends express.Request {
    readonly params: Readonly<{ id: string; }>;
}

interface IGetCategoriesRequest extends express.Request { }

interface IGetGendersRequest extends express.Request { }

interface IDeleteProductRequest extends express.Request {
    readonly params: Readonly<{ id: string; }>;
}

export {
    IAddProductRequest,
    IGetProductsRequest,
    IGetProductRequest,
    IGetCategoriesRequest,
    IGetGendersRequest,
    IDeleteProductRequest,
};