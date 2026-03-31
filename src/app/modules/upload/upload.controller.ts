import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uploadImagesIntoDB } from "./upload.service";

const uploadImages = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];

  const result = await uploadImagesIntoDB(files);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Images uploaded successfully!",
    data: result,
  });
});

export { uploadImages };
