import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    title: {
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
    description: {
      type: String,
      required: true,
      minLength: 30,
      manLength: 2000,
    },
    imgCover: String,
    images: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    sold: Number,
    stock: {
      type: Number,
      min: 0,
    },
    category: {
      type: Types.ObjectId,
      required: true,
      ref: "Category",
    },
    subCategory: {
      type: Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    brand: {
      type: Types.ObjectId,
      required: true,
      ref: "Brand",
    },
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    rateCount: Number,
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
    toJSON: { virtuals: true },
  }
);
schema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});
schema.pre("findOne", function () {
  this.populate("reviews");
});
schema.post("init", function (docs) {
  if (docs.imgCover)
    docs.imgCover = process.env.BASE_URL + "products/" + docs.imgCover;
  if (docs.images)
    docs.images = docs.images.map(
      (image) => process.env.BASE_URL + "products/" + image
    );
});

export const Product = model("Product", schema);
