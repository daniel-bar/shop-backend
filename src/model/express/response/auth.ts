import express from 'express';

import { FeedbackResponse } from '../../shared/response';

type IAuthMiddlewareResponse = express.Response<FeedbackResponse>;

type IAdminAuthMiddlewareResponse = express.Response<FeedbackResponse>;

type IRegisterResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{
            fullname: string;
            email: string;
            token: string;
        }>;
    }>>
>;

type ILoginResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{
            fullname: string;
            email: string;
            token: string;
        }>;
    }>>
>;

type IAutoLoginResponse = express.Response<
    FeedbackResponse & Readonly<Partial<{
        data: Readonly<{
            fullname: string;
            email: string;
        }>;
    }>>
>;

export {
    IAuthMiddlewareResponse,
    IAdminAuthMiddlewareResponse,
    IRegisterResponse,
    ILoginResponse,
    IAutoLoginResponse,
}