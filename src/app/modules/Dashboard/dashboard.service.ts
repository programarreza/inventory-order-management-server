import { activityLogService } from "../ActivityLog/activityLog.service";
import { OrderStatus } from "../Order/order.interface";
import { Order } from "../Order/order.model";
import { Product } from "../Product/product.model";

const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Total Orders Today
  const totalOrdersToday = await Order.countDocuments({
    createdAt: { $gte: today, $lt: tomorrow },
  });

  // Pending vs Completed Orders
  const pendingOrdersCount = await Order.countDocuments({
    status: OrderStatus.PENDING,
  });

  const completedOrdersCount = await Order.countDocuments({
    status: OrderStatus.DELIVERED,
  });

  // Low Stock Items Count
  const lowStockItemsCount = await Product.countDocuments({
    $expr: { $lt: ["$stock", "$minStock"] },
  });

  // Revenue Today
  const revenueTodayResult = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: today, $lt: tomorrow },
        status: { $ne: OrderStatus.CANCELLED },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  const revenueToday = revenueTodayResult.length > 0 ? revenueTodayResult[0].totalRevenue : 0;

  // 5. Product Summary
  const products = await Product.find().limit(10);
  const productSummary = products.map((p) => ({
    name: p.name,
    stock: p.stock,
    status: p.stock < p.minStock ? "Low Stock" : "OK",
  }));

  // 6. Recent Activities
  const recentActivities = await activityLogService.getRecentLogs(10);

  return {
    totalOrdersToday,
    pendingOrdersCount,
    completedOrdersCount,
    lowStockItemsCount,
    revenueToday,
    productSummary,
    recentActivities,
  };
};

export const dashboardService = {
  getDashboardStats,
};
