const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { roles } = require("../constants/index");

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
      enum: [roles.user, roles.provider, roles.admin],
      default: roles.user,
    },
    img: {
      type: String,
    },
    specialization: {
      type: String,
      enum: ["software engineer", "engineer", "manager"],
    },
    bio: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "accepted",
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

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  if (!candidatePassword || !userPassword) return false;
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = {
  User: mongoose.model("User", userSchema),
};
