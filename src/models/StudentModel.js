const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    name: String,
    roll: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    className: String,
    section: String,
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      default: "student",
    },
  },
  { timestamps: true, versionKey: false }
);

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const studentModel = model("Student", studentSchema);

module.exports = studentModel;
