import { Types } from "mongoose";

export enum ProductStatus {
  ACTIVE = "Active",
  OUT_OF_STOCK = "Out of Stock",
}

export interface IProduct {
  name: string;
  categoryId: Types.ObjectId;
  price: number;
  stock: number;
  minStock: number;
  status: ProductStatus;
  isActive?: boolean;
  createdBy?: Types.ObjectId;
}
