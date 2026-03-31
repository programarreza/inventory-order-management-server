import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";

const uploadImagesIntoDB = async (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No files uploaded!");
  }

  // Cloudinary storage already returns secure_url
  const urls = files.map((file) => (file as any).path);

  return { urls };
};

export { uploadImagesIntoDB };
