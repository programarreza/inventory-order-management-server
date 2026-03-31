import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { uploadImages } from "./upload.controller";

const uploadRoutes = Router();

// multiple upload, field name "images" must match frontend FormData.append("images", file)
uploadRoutes.post("/images", multerUpload.array("images", 10), uploadImages);

export default uploadRoutes;
