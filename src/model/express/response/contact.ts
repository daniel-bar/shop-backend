import express from 'express';

import { FeedbackResponse } from '../../shared/response';

type IContantResponse = express.Response<FeedbackResponse>;

export { IContantResponse }