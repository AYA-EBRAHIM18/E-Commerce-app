import { AppError } from "../../utilities/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.model.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51PltAMJs7opwPS1443BNZCwPJgwtSJUf3eC63eyKV3sY1wHIwCXvd7uK5COGR0nYvz65hJpUndUIsODtD09f8A8D00YQAv6pXj"
);
const createCashOrder = catchError(async (req, res, next) => {
  //1-get user cart by cartId
  let cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("cart Not Found", 404));

  //2-total order price
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;
  //3-create order
  let order = new Order({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  await order.save();
  //4-increment products stock decrement sold
  //? cart.cartItems.map(async (item) => {
  //?  let product = await Product.findOne(item.product);
  //?   product.sold += item.quantity;
  //?   product.stock -= item.quantity;
  //?   await product.save();
  //? });
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
  res.json({ message: "success", order });
});
const getUserOrders = catchError(async (req, res, next) => {
  let orders = await Order.findOne({ user: req.user._id }).populate(
    "orderItems.product"
  );
  res.json({ message: "success", orders });
});
const getAllOrders = catchError(async (req, res, next) => {
  let orders = await Order.find({});
  res.json({ message: "success", orders });
});
const createCheckoutSession = catchError(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("cart Not Found", 404));
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://hambozoo/netlify.app/#/orders",
    cancel_url: "https://hambozoo/netlify.app/#/cart",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.json({ message: "success", session });
});
export { createCashOrder, getUserOrders, getAllOrders, createCheckoutSession };
