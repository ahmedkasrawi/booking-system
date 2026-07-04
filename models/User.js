const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const schema = mongoose.Schema;

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user", "provider"],
      default: "user",
    },
    // optional field for providers to store their services
    specialization: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 2. ميثود مخصصة لمقارنة الباسورد عند تسجيل الدخول
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


module.exports = {
  User: mongoose.model("User", userSchema),
};
