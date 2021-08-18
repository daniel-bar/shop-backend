import bcrypt from "bcrypt";
import mongoose from "mongoose";

import ServerGlobal from "../server-global";

import { IUserDocument, UserDB, IUser } from "../model/user";

import { 
  IEditProfileRequest, 
  IAddProductsToBagRequest,
  IGetInBagProductsRequest,
} from "../model/express/request/user";
import { 
  IEditProfileResponse,
  IAddProductsToBagResponse,
  IGetInBagProductsResponse,
} from "../model/express/response/user";

const editProfile = async (req: IEditProfileRequest, res: IEditProfileResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<editProfile>: Start processing request with user id ${req.userId!}`
  );

  // Check whether provided fields are valid
  if (
    (req.body.newPassword!.length < 7 && req.body.newPassword!.length > 0) ||
    req.body.newPassword!.length > 24
  ) {
    res.status(400).send({
      success: false,
      message: "Invalid form fields",
    });
    return;
  }

  try {
    // Find the user
    const userByID: Pick<
      IUserDocument,
      keyof mongoose.Document | "id" | "email" | "password"
    > | null = await UserDB.findById(req.userId, { password: 1 });

    if (!userByID) {
      ServerGlobal.getInstance().logger.error(
        `<editProfile>: Failed to get user details for user id ${req.userId!}`
      );

      res.status(401).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }

    // Check whether provided current password is correct
    const compareResult = await bcrypt.compare(
      req.body.password,
      userByID.password
    );

    if (!compareResult) {
      ServerGlobal.getInstance().logger.error(
        `<editProfile>: Failed to edit profile because \
provided password mismatches for user id ${req.userId!}`
      );

      res.status(400).send({
        success: false,
        message: "Mismatch password",
      });
      return;
    }

    // Update user's email if client wants to
    if (req.body.newEmail !== "") {
      (userByID.email as string) === req.body.newEmail;
    }

    // Update user's password if client wants to
    if (req.body.newPassword !== "") {
      const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 8);

      userByID.password = hashedNewPassword;
    }

    await userByID.save();

    ServerGlobal.getInstance().logger.info(
      `<editProfile>: Successfully edited user profile with id ${req.userId}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully edited user details",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<editProfile>: Failed to edit profile because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const addProductsToBag = async (req: IAddProductsToBagRequest, res: IAddProductsToBagResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<addProductsToBag>: Start processing request with user id ${req.userId!}`
  );

  // Check whether provided field is valid
  if (!req.body.productsId) {
    res.status(400).send({
      success: false,
      message: "Invalid field",
    });
    return;
  }

  try {
    // Find the user
    const userByID: Pick<
      IUserDocument,
      keyof mongoose.Document | 'id' | 'inBagProducts' 
    > | null = await UserDB.findById(req.userId);

    if (!userByID) {
      ServerGlobal.getInstance().logger.error(
        `<addProductsToBag>: Failed to get user details for user id ${req.userId!}`
      );

      res.status(401).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }

    // Update user's product bag
    userByID.inBagProducts === req.body.productsId;

    await userByID.save();

    ServerGlobal.getInstance().logger.info(
      `<addProductsToBag>: Successfully added products to bag for user id ${req.userId}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully added products to bag",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<addProductsToBag>: Failed to add products to bag for user id ${req.userId} because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const getInBagProducts = async (req: IGetInBagProductsRequest, res: IGetInBagProductsResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<getInBagProducts>: Start processing request for user id ${req.userId!}`
  );

  try {
    type product = Pick<IUser, 'id' | 'inBagProducts'>;

    const products: ReadonlyArray<product> = await UserDB.aggregate<product>(
      [
        {
          $match: { owner: req.userId! },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: { cardNumber: 1 },
        },
      ]
    );

    ServerGlobal.getInstance().logger.info(
      `<getInBagProducts>: Successfully got the in bag products for user with id ${req.userId!}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully retrieved products",
      data: products.map((product) => ({
        id: product.id,
        inBagProducts: product.inBagProducts,
      })),
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<getInBagProducts>: Failed to get the products for user id ${req.userId!} \
because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};


export { 
  editProfile,
  addProductsToBag,
  getInBagProducts,
};
