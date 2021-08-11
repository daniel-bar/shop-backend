import mongoose from "mongoose";
import multer from "multer";
import mime from "mime-types";

import ServerGlobal from "../server-global";

import { IProductDocument, ProductDB } from "../model/product";

import {
  IAddProductRequest,
  IgetProductsRequest,
  IGetProductRequest,
  IGetCategoriesRequest,
  IGetGendersRequest,
  IDeleteProductRequest,
} from "../model/express/request/product";
import {
  IAddProductResponse,
  IgetProductsResponse,
  IGetProductResponse,
  IGetCategoriesResponse,
  IGetGendersResponse,
  IDeleteProductResponse,
} from "../model/express/response/product";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./images");
  },
  filename(req, file, cb) {
    const ext = mime.extension(file.mimetype);
    const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    cb(null, `${Date.now()}-${random}.${ext}`);
  },
});

const addProduct = async (
  req: IAddProductRequest,
  res: IAddProductResponse
) => {
  ServerGlobal.getInstance().logger.info(
    "<addProduct>: Start processing request"
  );

  try {
    // Validate provided title and content of valid length
    if (
      req.body.title.length < 3 ||
      req.body.title.length > 50 ||
      req.body.description.length < 3 ||
      req.body.description.length > 350
    ) {
      ServerGlobal.getInstance().logger.error(
        "<addProduct>: Failed to add product because invalid product fields length"
      );

      res.status(400).send({
        success: false,
        message: "Please provide valid length of product fields",
      });
      return;
    }

    // Validate provided category
    if (
      isNaN(+req.body.category) ||
      !ServerGlobal.getInstance().isValidCategoryValue(+req.body.category)
    ) {
      ServerGlobal.getInstance().logger.error(
        "<addProduct>: Failed to add product because invalid category"
      );

      res.status(400).send({
        success: false,
        message: "Please provide valid category",
      });
      return;
    }

    // Validate provided gender
    if (
      isNaN(+req.body.gender) ||
      !ServerGlobal.getInstance().isValidGenderValue(+req.body.gender)
    ) {
      ServerGlobal.getInstance().logger.error(
        "<addProduct>: Failed to add product because invalid gender"
      );

      res.status(400).send({
        success: false,
        message: "Please provide valid gender",
      });
      return;
    }

    // Validate provided price
    if (isNaN(+req.body.price)) {
      ServerGlobal.getInstance().logger.error(
        "<addProduct>: Failed to add product because invalid price"
      );

      res.status(400).send({
        success: false,
        message: "Please provide valid price",
      });
      return;
    }

    // Creating the product
    const newProduct = new ProductDB({
      category: +req.body.category,
      gender: +req.body.gender,
      title: req.body.title,
      description: req.body.description,
      price: +req.body.price,
      imageFilename: req.file.filename,
    });

    // Saving the product in DB
    await newProduct.save();

    ServerGlobal.getInstance().logger.info(
      `<addProduct>: Successfully added product with id: ${newProduct.id}`
    );

    res.status(201).send({
      success: true,
      message: "Successfully created a new product",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<addProduct>: Failed to add product because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

// const getProducts = async (
//   req: IgetProductsRequest,
//   res: IgetProductsResponse
// ) => {
//   ServerGlobal.getInstance().logger.info(
//     `<getProducts>: Start processing request filtered by \
// category ${req.params.category} and gender ${req.params.gender}`
//   );

//   if (!ServerGlobal.getInstance().isValidCategoryValue(+req.params.category!)) {
//     ServerGlobal.getInstance().logger.error(
//       `<getProducts>: Failed to get products because of invalid category filtered by category ${req.params.category} \
// and gender ${req.params.gender}`
//     );

//     res.status(400).send({
//       success: false,
//       message: "Please provide valid category",
//     });
//     return;
//   }

//   if (
//     !ServerGlobal.getInstance().isValidGenderValue(+req.params.gender!)
//   ) {
//     ServerGlobal.getInstance().logger.error(
//       `<getProducts>: Failed to get products because of invalid gender filtered by category ${req.params.category} \
//  and gender ${req.params.gender}`
//     );

//     res.status(400).send({
//       success: false,
//       message: "Please provide valid gender",
//     });
//     return;
//   }

//   try {
//     const products = await ProductDB.find({
//       category: +req.params.category!,
//       gender: +req.params.gender!,
//     });

//     ServerGlobal.getInstance().logger.info(
//       `<getProducts>: Successfully got the products filtered by \
// category ${req.params.category} and gender ${req.params.gender}`
//     );

//     res.status(200).send({
//       success: true,
//       message: "Successfully retrieved products",
//       data: products.map((product) => ({
//         id: product.id as string,
//         category: {
//           value: product.category,
//           label: ServerGlobal.getInstance().getCategoryLabel(product.category)!,
//         },
//         gender: {
//           value: product.gender,
//           label: ServerGlobal.getInstance().getGenderLabel(product.gender)!,
//         },
//         title: product.title,
//         description: product.description,
//         price: product.price,
//         imageFilename: product.imageFilename,
//       })),
//     });
//     return;
//   } catch (e) {
//     ServerGlobal.getInstance().logger.error(
//       `<getProducts>: Failed to get products filtered by \
// category ${req.params.category} and gender ${req.params.gender} because of server error: ${e}`
//     );

//     res.status(500).send({
//       success: false,
//       message: "Server error",
//     });
//     return;
//   }
// };

const getProducts = async (
  req: IgetProductsRequest,
  res: IgetProductsResponse
) => {
  ServerGlobal.getInstance().logger.info(
    `<getProducts>: Start processing request filtered by \
category ${req.params.category} and gender ${req.params.gender}`
  );

  if (!req.params.category && !req.params.gender) {
    ServerGlobal.getInstance().logger.error(
      `<getProducts>: Failed to get products because of invalid category or gender filtered by category ${req.params.category} \
and gender ${req.params.gender}`
    );

    res.status(400).send({
      success: false,
      message: "Please provide a category and/or gender",
    });
    return;    
  }

  const dbQueryParams: any = { };
 
  if (req.params.category && !ServerGlobal.getInstance().isValidCategoryValue(+req.params.category!)) {
    ServerGlobal.getInstance().logger.error(
      `<getProducts>: Failed to get products because of invalid category filtered by category ${req.params.category} \
and gender ${req.params.gender}`
    );

    res.status(400).send({
      success: false,
      message: "Please provide valid category",
    });
    return;
  }
  else {
    dbQueryParams.category = +req.params.category!
  }

  if (req.params.gender &&
    !ServerGlobal.getInstance().isValidGenderValue(+req.params.gender!)
  ) {
    ServerGlobal.getInstance().logger.error(
      `<getProducts>: Failed to get products because of invalid gender filtered by category ${req.params.category} \
 and gender ${req.params.gender}`
    );

    res.status(400).send({
      success: false,
      message: "Please provide valid gender",
    });
    return;
  }
  else {
    dbQueryParams.gender = +req.params.gender!
  }

  try {    
    console.log(dbQueryParams);
    const products = await ProductDB.find(dbQueryParams);

    ServerGlobal.getInstance().logger.info(
      `<getProducts>: Successfully got the products filtered by \
category ${req.params.category} and gender ${req.params.gender}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully retrieved products",
      data: products.map((product) => ({
        id: product.id as string,
        category: {
          value: product.category,
          label: ServerGlobal.getInstance().getCategoryLabel(product.category)!,
        },
        gender: {
          value: product.gender,
          label: ServerGlobal.getInstance().getGenderLabel(product.gender)!,
        },
        title: product.title,
        description: product.description,
        price: product.price,
        imageFilename: product.imageFilename,
      })),
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<getProducts>: Failed to get products filtered by \
category ${req.params.category} and gender ${req.params.gender} because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const getProduct = async (
  req: IGetProductRequest,
  res: IGetProductResponse
) => {
  ServerGlobal.getInstance().logger.info(
    `<getProduct>: Start processing request with product Id ${req.params.id}`
  );

  try {
    const product = await ProductDB.findById(req.params.id);

    if (!product) {
      ServerGlobal.getInstance().logger.error(
        `<getProduct>: Failed to find product with id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find product",
      });
      return;
    }

    ServerGlobal.getInstance().logger.info(
      `<getProduct>: Successfully got product with id ${req.params.id}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully retrieved product",
      data: {
        category: {
          value: product.category,
          label: ServerGlobal.getInstance().getCategoryLabel(product.category)!,
        },
        gender: {
          value: product.gender,
          label: ServerGlobal.getInstance().getGenderLabel(product.gender)!,
        },
        title: product.title,
        description: product.description,
        price: product.price,
        imageFilename: product.imageFilename,
      },
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<getProduct>: Failed to get product with id ${req.params.id} because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const getCategories = async (
  req: IGetCategoriesRequest,
  res: IGetCategoriesResponse
) => {
  ServerGlobal.getInstance().logger.info(
    "<getCategories>: Start processing request"
  );

  ServerGlobal.getInstance().logger.info(
    "<getCategories>: Successfully processed request"
  );

  res.status(200).send({
    success: true,
    message: "Successfully retrieved categories",
    data: ServerGlobal.getInstance().productCategories,
  });
  return;
};

const getGenders = async (
  req: IGetGendersRequest,
  res: IGetGendersResponse
) => {
  ServerGlobal.getInstance().logger.info(
    "<getGenders>: Start processing request"
  );

  ServerGlobal.getInstance().logger.info(
    "<getGenders>: Successfully processed request"
  );

  res.status(200).send({
    success: true,
    message: "Successfully retrieved categories",
    data: ServerGlobal.getInstance().productGenders,
  });
  return;
};

const deleteProduct = async (
  req: IDeleteProductRequest,
  res: IDeleteProductResponse
) => {
  ServerGlobal.getInstance().logger.info(
    `<deleteProduct>: Start processing request with product id ${req.params.id}`
  );

  try {
    const id = mongoose.Types.ObjectId(req.params.id);

    await ProductDB.deleteOne({ id });

    ServerGlobal.getInstance().logger.info(
      `<deleteProduct>: Successfully deleted product with ${req.params.id}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully deleted product",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<deleteProduct>: Failed to delete product with id: ${req.params.id}. because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

export {
  storage,
  addProduct,
  getProducts,
  getProduct,
  getCategories,
  getGenders,
  deleteProduct,
};
