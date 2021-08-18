import express from "express";

import { IAuthenticatedRequest } from "./auth";

interface IEditProfileRequest extends IAuthenticatedRequest {
  readonly body: Readonly<{
    password: string;
    newEmail?: string;
    newPassword?: string;
  }>;
}

interface IAddProductsToBagRequest extends IAuthenticatedRequest {
  readonly body: Readonly<{
    productsId: string[];
  }>;
}


interface IGetInBagProductsRequest extends IAuthenticatedRequest { }

export { 
  IEditProfileRequest,
  IAddProductsToBagRequest,
  IGetInBagProductsRequest,
};