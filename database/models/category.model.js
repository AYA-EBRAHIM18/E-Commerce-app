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
      unique: true,
      required: true,
    },
    img: String,
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

schema.post("init", function (docs) {
  if (docs.img) docs.img = process.env.BASE_URL + "categories/" + docs.img;
});

export const Category = model("Category", schema);
