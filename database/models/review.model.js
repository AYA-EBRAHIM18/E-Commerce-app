import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    comment: String,
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
  }
);

schema.pre(/^find/, function () {
  this.populate("user", "name -_id");
});

export const Review = model("Review", schema);
