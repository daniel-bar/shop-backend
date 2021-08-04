import express from "express";

import { IServerResponse } from "../../shared/response";

type IEditProfileResponse = express.Response<IServerResponse>;

export { IEditProfileResponse };
