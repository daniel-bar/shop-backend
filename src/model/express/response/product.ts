import express from 'express';

import { FeedbackResponse } from '../../shared/response';

import { ProductCategory } from '../../../server-global';

type IAddProductResponse = express.Response<FeedbackResponse>;

type IGetProductsResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: ReadonlyArray<Readonly<{
            id: string;
            category: ProductCategory;
            title: string;
            description: string;
            price: number;
        }>>;
    }>>
>;

type IGetProductResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{
            category: string;
            title: string;
            description: string;
            price: number;
        }>;
    }>>
>;

type IGetCategoriesResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{ categories: ReadonlyArray<Readonly<{ value: ProductCategory, label: string }>> }>;
    }>>
>;

export {
    IAddProductResponse,
    IGetProductsResponse,
    IGetProductResponse,
    IGetCategoriesResponse,
}