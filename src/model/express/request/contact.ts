import { IAuthenticatedRequest } from './auth';

interface IContantRequest extends IAuthenticatedRequest {
    readonly body: Readonly<{ message: string }>;
}

export { IContantRequest };