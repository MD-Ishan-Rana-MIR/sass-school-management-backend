const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    name: {
      type: String,
    },
    role: {
      type: String,
      default: "admin",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    schoolId: {
      type: String,
      ref: "school",
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const adminModel = model("admin", adminSchema);

module.exports = adminModel;
