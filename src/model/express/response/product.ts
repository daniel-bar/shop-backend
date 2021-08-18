import express from 'express';

import {
    ProductCategory,
    ProductGender,
} from '../../../server-global';

import { IServerResponse } from '../../shared/response';

type IAddProductResponse = express.Response<IServerResponse>;

type IgetProductsResponse = express.Response<
    IServerResponse & {
        data?: {
            id: string;
            category: { value: ProductCategory, label: string };
            gender: { value: ProductGender, label: string };
            title: string;
            description: string;
            price: number;
            imageFileName: string;
        }[];
    }
>;

type IGetProductResponse = express.Response<
    IServerResponse & {
        data?: {
            category: { value: ProductCategory, label: string };
            gender: { value: ProductGender, label: string };
            title: string;
            description: string;
            price: number;
            imageFileName: string;
        };
    }
>;

type IGetCategoriesResponse = express.Response<
    IServerResponse & {
        data?: {
            value: ProductCategory,
            label: string,
        }[];
    }
>;

type IGetGendersResponse = express.Response<
    IServerResponse & {
        data?: {
            value: ProductGender,
            label: string,
        }[];
    }
>;

type IDeleteProductResponse = express.Response<IServerResponse>;

export {
    IAddProductResponse,
    IgetProductsResponse,
    IGetProductResponse,
    IGetCategoriesResponse,
    IGetGendersResponse,
    IDeleteProductResponse,
};