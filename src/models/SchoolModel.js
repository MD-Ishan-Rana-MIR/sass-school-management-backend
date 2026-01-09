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
      // requird: true,
    },
    schoolEmail: {
      type: String,
      required: true,
      uniqui: true,
    },
    contactNumber: {
      type: String,
    },
    schoolId: {
      type: String,
      // required: true,
    },
    status : {
      type : Boolean,
      default : true
      
    }
  },

  { timestamps: true, versionKey: false }
);

const schoolModel = model("school", schoolSchema);

module.exports = schoolModel;
