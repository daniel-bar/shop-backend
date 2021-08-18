import express from "express";
import multer from "multer";

import { adminAuth } from "../middleware/auth";

import {
  storage,
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  getCategories,
  getGenders,
} from "../controller/product";

const router = express.Router();

router.post("/", adminAuth, multer({ storage }).single("image"), addProduct);

router.get("/list", getProducts);

router.get("/categories", getCategories);

router.delete('/:id', deleteProduct);

router.get("/genders", getGenders);

router.get("/:id", getProduct);

export default router;