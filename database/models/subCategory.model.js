import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "Name is required."],
      trim: true,
      required: true,
      minLength: [2, "Too short category name."],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
  }
);

export const SubCategory = model("SubCategory", schema);
