import express from "express";

import { bodyKeys } from "../middleware/security";
import { auth } from "../middleware/auth";

import { 
  editProfile,
  addProductsToBag,
  getInBagProducts,
} from "../controller/user";

const router = express.Router();

router.patch(
  "/",
  auth,
  bodyKeys([{ key: "password", type: "string" }]),
  editProfile,
);

router.post(
  '/',
  auth,
  addProductsToBag,
)

router.get(
  "/:id",
  getInBagProducts,
);

export default router;
