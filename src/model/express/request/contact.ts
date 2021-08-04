import { IAuthenticatedRequest } from './auth';

import { Topic } from '../../shared/topic';

interface IContantRequest extends IAuthenticatedRequest {
    readonly body: Readonly<{
        topic: Topic,
        message: string,
    }>;
}

interface IGetTopicsRequest extends IAuthenticatedRequest { }

export {
    IContantRequest,
    IGetTopicsRequest,
};