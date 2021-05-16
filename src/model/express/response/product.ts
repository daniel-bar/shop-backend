import express from 'express';

import { FeedbackResponse } from '../../shared/response';

import { ProductCategory } from '../../../server-global';

import { ProductGender } from '../../product';

type IAddProductResponse = express.Response<FeedbackResponse>;

type IGetProductsResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: ReadonlyArray<Readonly<{
            id: string;
            category: ProductCategory;
            gender: ProductGender;
            title: string;
            description: string;
            price: number;
            image: string;
        }>>;
    }>>
>;

type IGetProductResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{
            category: string;
            gender: string;
            title: string;
            description: string;
            price: number;
            image: string;
        }>;
    }>>
>;

type IGetCategoriesResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{ categories: ReadonlyArray<Readonly<{ value: ProductCategory, label: string }>> }>;
    }>>
>;

type IDeleteProductResponse = express.Response<FeedbackResponse>;

type IGetProductsSumResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{ sum: object }>;
    }>>
>;

export {
    IAddProductResponse,
    IGetProductsResponse,
    IGetProductResponse,
    IGetCategoriesResponse,
    IDeleteProductResponse,
    IGetProductsSumResponse,
}