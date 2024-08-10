import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    expires: Date,
    discount: Number,
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
  }
);

export const Coupon = model("Coupon", schema);
