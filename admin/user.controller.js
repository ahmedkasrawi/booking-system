const { User } = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");

const appError = require("../utils/appError");
const { generateToken } = require("../utils/authUtil");
const getData = require("../utils/getData");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const filter = {}; // filter by role
  if (req.query.role) filter.role = req.query.role;
  const [data, pagination] = await getData(req, filter, User);
  if (!data || !pagination) {
    return next(new appError("something went wrong", 404));
  }
  res.status(200).json({
    status: "success",
    results: data.length,
    pagination: pagination,
    data: { users: data },
  });
});

const updateUserStatus = asyncWrapper(async (req, res, next) => {
  const { status } = req.body;
  const userId = req.params.id;
  if (!status) {
    return next(new appError("Please provide status", 400));
  }
  const validStatuses = ["pending", "accepted", "blocked"];
  if (!validStatuses.includes(status)) {
    return next(
      new appError(
        "Invalid status value, allow with  [pending, accepted, blocked]",
        400,
      ),
    );
  }
  const data = await User.findByIdAndUpdate(userId, { status }, { new: true });
  if (!data) {
    return next(new appError("Provider Not Found", 400));
  }
  res.status(200).json({
    status: "success",
    data: { user: data },
  });
});

const getUsersData = asyncWrapper(async (req, res, next) => {
  // 1. تحديد النطاق الزمني
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
  oneWeekAgo.setHours(0, 0, 0, 0);

  // 2. جلب البيانات من قاعدة البيانات
  const dbResult = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: oneWeekAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "Africa/Cairo", // ضمان توافق التوقيت مع المستخدم
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // 3. تحويل مصفوفة البيانات إلى Hash Map للوصول السريع جداً O(1)
  // النتيجة ستكون كائن بهذا الشكل: { "2026-07-10": 2, "2026-07-12": 5 }
  let totalWeeklyUsers = 0;
  const dbDataMap = dbResult.reduce((acc, current) => {
    acc[current._id] = current.count;
    totalWeeklyUsers += current.count; // حساب العدد الكلي في نفس الخطوة
    return acc;
  }, {});

  // 4. معالجة الأيام الفارغة بالتوقيت المحلي (Local Time)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    // بناء التاريخ المحلي وتنسيقه ليصبح YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    chartData.push({
      date: dateStr,
      // جلب العدد مباشرة من الكائن، وإن لم يوجد نضع صفر
      count: dbDataMap[dateStr] || 0,
    });
  }

  // 5. إرسال الاستجابة النهائية
  res.status(200).json({
    status: "success",
    data: {
      totalWeeklyUsers,
      chartData,
    },
  });
});

module.exports = {
  getAllUsers,
  updateUserStatus,
  getUsersData,
};
