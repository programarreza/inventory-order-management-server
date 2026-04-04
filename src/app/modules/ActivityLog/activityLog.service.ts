import { ActivityLog } from "./activityLog.model";

const createLog = async (message: string, user?: string) => {
  return await ActivityLog.create({
    message,
    user,
    timestamp: new Date(),
  });
};

const getRecentLogs = async (limit: number = 10) => {
  return await ActivityLog.find().sort({ timestamp: -1 }).limit(limit);
};

export const activityLogService = {
  createLog,
  getRecentLogs,
};
