import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { AppError } from "./../utilities/appError.js";
const fileUpload = (folderName) => {
  // const upload = multer({ dest: "uploads/" });
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + " " + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("file must be an image", 404), false);
    }
  }
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1 * 1024 * 1024, //4 Mb
    },
  });
  return upload;
};
export const uploadSingleFile = (fieldName, folderName) =>
  fileUpload(folderName).single(fieldName);

export const uploadMixOfFiles = (arrayOfFields, folderName) =>
  fileUpload(folderName).fields(arrayOfFields);
