import express from "express";

import { bodyKeys } from "../middleware/security";
import { auth } from "../middleware/auth";

import { editProfile } from "../controller/user";

const router = express.Router();

router.patch(
  "/",
  auth,
  bodyKeys([{ key: "password", type: "string" }]),
  editProfile
);

export default router;
