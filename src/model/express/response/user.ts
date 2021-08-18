import express from "express";

import { IServerResponse } from "../../shared/response";

type IEditProfileResponse = express.Response<IServerResponse>;

type IAddProductsToBagResponse = express.Response<IServerResponse>;

type IGetInBagProductsResponse = express.Response<
    IServerResponse & {
        data?: { inBagProducts: string[]; }[];
    }
>;

export { 
    IEditProfileResponse,
    IAddProductsToBagResponse,
    IGetInBagProductsResponse,
};
