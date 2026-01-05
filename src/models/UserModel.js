const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      default: "student",
    },
    // schoolId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "School",
    // },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const userModel = model("User", userSchema);

module.exports = userModel;
