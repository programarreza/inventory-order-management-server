interface ExtendedParams {
  resource_type: string;
  folder?: string;
}

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    folder: "resources",
    resource_type: "auto",
    allowed_formats: [
      "pdf",
      "mp4",
      "mov",
      "avi",
      "jpeg",
      "jpg",
      "png",
      "webp",
      "gif",
      "bmp",
      "tiff",
      "heic",
      "heif",
      "avif",
      "ico",
      "svg",
      "apng",
    ],
  } as ExtendedParams,
});

import { allowedMimeTypes } from "../modules/upload/upload.constant";

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type ${file.mimetype}`));
  }
};

export const multerUpload = multer({
  storage,
  fileFilter,
});
