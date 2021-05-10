import { IAuthenticatedRequest } from './auth';

enum Topic {
    Delivery = 'delivery',
    ReturnsAndRefunds = 'returns & refunds',
    OrderIssues = 'oreder issues',
    Technical = 'technical',
}

interface IContantRequest extends IAuthenticatedRequest {
    readonly body: Readonly<{ topic: Topic, message: string }>;
}

export { IContantRequest }