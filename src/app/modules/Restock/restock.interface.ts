import { Types } from "mongoose";

export enum RestockPriority {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export interface IRestock {
  productId: Types.ObjectId;
  currentStock: number;
  minStock: number;
  priority: RestockPriority;
  isResolved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
