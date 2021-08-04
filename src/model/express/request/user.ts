import { IAuthenticatedRequest } from "./auth";

interface IEditProfileRequest extends IAuthenticatedRequest {
  readonly body: Readonly<{
    password: string;
    newEmail?: string;
    newPassword?: string;
  }>;
}

export { IEditProfileRequest };
