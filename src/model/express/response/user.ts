import express from 'express';

import { FeedbackResponse } from '../../shared/response';

type IEditProfileResponse = express.Response<FeedbackResponse>;

export { IEditProfileResponse }