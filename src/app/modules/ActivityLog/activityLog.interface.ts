import { Types } from "mongoose";

export interface IActivityLog {
  message: string;
  timestamp: Date;
  user?: string; // Optional: name or email of the user
}
