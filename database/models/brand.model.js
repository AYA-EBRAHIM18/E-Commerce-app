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
    logo: String,
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
  if (docs.logo) docs.logo = process.env.BASE_URL + "brands/" + docs.logo;
  console.log(docs);
});
export const Brand = model("Brand", schema);
