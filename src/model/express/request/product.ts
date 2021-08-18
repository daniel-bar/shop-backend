import express from "express";

import { IAuthenticatedRequest } from "./auth";

interface IAddProductRequest extends express.Request {
  readonly body: Readonly<{
    category: string;
    gender: string;
    title: string;
    description: string;
    price: string;
  }>;
}

interface IgetProductsRequest extends express.Request {
  readonly query: Readonly<{
    gender?: string;
    category?: string;
  }>;
}

interface IGetProductRequest extends express.Request {
  readonly params: Readonly<{ id: string }>;
}

interface IGetCategoriesRequest extends express.Request {}

interface IGetGendersRequest extends express.Request {}

interface IDeleteProductRequest extends express.Request {
  readonly params: Readonly<{ id: string }>;
}

export {
  IAddProductRequest,
  IgetProductsRequest,
  IGetProductRequest,
  IGetCategoriesRequest,
  IGetGendersRequest,
  IDeleteProductRequest,
}
