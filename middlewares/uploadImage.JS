const multer = require("multer");
const sharp = require("sharp");
const appError = require("../utils/appError");

// store buffer in memory storage
const multerStorage = multer.memoryStorage();

// is img ? sure that it is true img
const multerFilter = (req, file, next) => {
  if (file.mimetype.startsWith("image")) {
    next(null, true);
  } else {
    next(new appError("Only images are allowed", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // حد أقصى 2 ميجابايت للصورة
});

// ميدل وير جاهز لاستقبال حقل اسمه "image"
exports.uploadSingleImage = upload.single("image");

// 3. ميدل وير تغيير مقاسات الصورة بـ Sharp
exports.resizeImage = async (req, res, next) => {
  if (!req.file) return next(); // لو لم يرسل صورة، اكمل للـ Controller بشكل طبيعي

  try {
    // معالجة الصورة في الذاكرة وتغيير مقاساتها لتصبح مربعة 500x500 ومضغوطة بجودة 80%
    req.file.processedBuffer = await sharp(req.file.buffer)
      .resize(500, 500, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toBuffer();

    next();
  } catch (err) {
    next(new appError("Image processing failed", 500));
  }
};