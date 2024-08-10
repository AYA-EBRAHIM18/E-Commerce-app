import express from "express";
import "dotenv/config";
import { dbConnection } from "./database/dbConnection.js";
import categoryRouter from "./src/modules/category/category.routes.js";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utilities/appError.js";
import errorHandler from "./src/middleware/globalErrorHandling.js";
import cors from "cors";
import { catchError } from "./src/middleware/catchError.js";
import Stripe from "stripe";
import { Order } from "./database/models/order.model.js";
import { User } from "./database/models/user.model.js";
import { Cart } from "./database/models/cart.model.js";
import { Product } from "./database/models/product.model.js";
const stripe = new Stripe(process.env.STRIPE_TEST_KEY);
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
console.log(process.env);
//Before the express.json body parser
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  catchError(async (req, res, next) => {
    const sig = req.headers["stripe-signature"].toString();

    let event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      "whsec_I0VQWxlHVO5G8BX6s7j5dEJq88XaPTC1"
    );
    let checkout;
    if (event.type == "checkout.session.completed") {
      checkout = event.data.object;

      //3-create order
      let user = await User.findOne({ email: checkout.customer_email });
      let cart = await Cart.findById(checkout.client_reference_id);
      if (!cart) return next(new AppError("cart Not Found", 404));
      let order = new Order({
        user: user._id,
        orderItems: cart.cartItems,
        shippingAddress: checkout.metadata,
        totalOrderPrice: checkout.amount_total / 100,
        paymentType: "card",
        isPaid: true,
      });
      await order.save();

      let options = cart.cartItems.map((prod) => {
        return {
          updateOne: {
            filter: { _id: prod.product },
            update: {
              $inc: { sold: prod.quantity, stock: -prod.quantity },
            },
          },
        };
      });
      await Product.bulkWrite(options);
      //5-clear user cart
      await Cart.findByIdAndDelete(cart._id);
    }
    res.json({ message: "success", checkout });
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/categories", categoryRouter);
bootstrap(app);
app.use("*", (req, res, next) => {
  next(new AppError(`Route Not Found ${req.originalUrl}`, 404));
});
app.use(errorHandler);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
