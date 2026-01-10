const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const { Schema, model } = mongoose;

const teacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
      unique: true,
    },
    courseName: [
      {
        type: String,
        required: true,
      },
    ],
    education: [
      {
        type: String,
        required: true,
      },
    ],
    role: {
      type: String,
      default: "teacher",
    },
    isActive : {
      type : Boolean,
      default : true
    },
    department : {
      type : String
    },
    profileImg: {
      type: String,
      default: "/uploads/img.jpg",
    },
  },
  { timestamps: true, versionKey: false }
);

teacherSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const teacherModel = model("teachers", teacherSchema);

module.exports = teacherModel;
