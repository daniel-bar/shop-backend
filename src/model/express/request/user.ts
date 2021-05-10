import { IAuthenticatedRequest } from './auth';

interface IEditProfileRequest extends IAuthenticatedRequest {
    readonly body: Readonly<{
        currentPassword: string;
        newEmail: string;
        newPassword: string;
    }>;
}

export { IEditProfileRequest }
