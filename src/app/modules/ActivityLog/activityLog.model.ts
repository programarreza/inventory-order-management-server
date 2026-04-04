import { Schema, model } from "mongoose";
import { IActivityLog } from "./activityLog.interface";

const activityLogSchema = new Schema<IActivityLog>(
  {
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

export const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema);
