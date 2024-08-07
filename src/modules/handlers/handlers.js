import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";

const deleteOne = (model) => {
  return catchError(async (req, res, next) => {
    let document = await model.findByIdAndDelete(req.params.id);
    document || next(new AppError("document Not Found.", 404));
    !document || res.json({ message: "success", document });
  });
};
//!works only for brand and subCategory
const updateOne = (model) => {
  return catchError(async (req, res, next) => {
    if (req.body.slug) req.body.slug = slugify(req.body.name);
    if (req.file) req.body.logo = req.file.filename;

    let document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    document || next(new AppError("document Not Found.", 404));
    !document || res.json({ message: "success", document });
  });
};

export { deleteOne, updateOne };
