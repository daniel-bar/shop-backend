import express from "express";

import { bodyKeys } from "../middleware/security";
import { auth } from "../middleware/auth";

import {
  getPayments,
  checkoutWithExistingPayment,
  checkoutWithNewPayment,
} from "../controller/payment";

const router = express.Router();

router.get("/all", auth, getPayments);

router.post(
  "/checkout/existing",
  auth,
  bodyKeys([{ key: "paymentId", type: "string" }]),
  checkoutWithExistingPayment
);

router.post(
  "/checkout/new",
  auth,
  bodyKeys([{ key: "save", type: "boolean" }]),
  checkoutWithNewPayment
);

export default router;
