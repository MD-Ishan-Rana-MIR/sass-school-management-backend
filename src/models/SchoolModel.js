const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const schoolSchema = new Schema(
  {
    schoolName: {
      type: String,
      requird: true,
      unique: true,
    },
    schoolLogo: {
      type: String,
      requird: true,
    },
    schoolEmail: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    schoolId: {
      type: String,
      required: true,
    },
  },

  { timestamps: true, versionKey: false }
);

const schoolModel = model("school", schoolSchema);

module.exports = schoolModel;
