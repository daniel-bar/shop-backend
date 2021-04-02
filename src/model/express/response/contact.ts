import express from 'express';

import { FeedbackResponse } from '../../shared/response';

type IHandleContantResponse = express.Response<FeedbackResponse>;

export { IHandleContantResponse }