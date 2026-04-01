import { RestockPriority } from "../modules/Restock/restock.interface";

export const calculatePriority = (stock: number, minStock: number) => {
  if (stock <= 2) return RestockPriority.HIGH;
  if (stock <= minStock) return RestockPriority.MEDIUM;
  return RestockPriority.LOW;
};
