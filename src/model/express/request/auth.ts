import express from 'express';

interface IAuthMiddlewareRequest extends express.Request {
    userId?: string;
}

interface IAdminAuthMiddlewareRequest extends express.Request { }

interface IAuthenticatedRequest extends express.Request {
    readonly userId?: string;
}

interface IRegisterRequest extends express.Request {
    readonly body: Readonly<{
        fullname: string;
        email: string;
        password: string;
    }>;
}

interface ILoginRequest extends express.Request {
    readonly body: Readonly<{
        email: string;
        password: string;
    }>;
}

interface IAutoLoginRequest extends express.Request { }

export {
    IAdminAuthMiddlewareRequest,
    IAuthMiddlewareRequest,
    IAuthenticatedRequest,
    IRegisterRequest,
    ILoginRequest,
    IAutoLoginRequest,
}