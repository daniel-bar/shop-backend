import express from "express";

import "./db/mongoose";

import authRouter from "./router/auth";
import contactRouter from "./router/contact";
import productRouter from "./router/product";
import userRouter from "./router/user";
import paymentRouter from "./router/payment";

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.HTTP_ACCESS_IP);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PATCH, DELETE"
    );
    next();
  }
);

app.get(
  "/alive",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    res.status(200).send("Shop server is alive")
);

app.use("/auth", authRouter);
app.use("/contact", contactRouter);
app.use("/product", productRouter);
app.use("/profile", userRouter);
app.use("/payment", paymentRouter);

export default app;
