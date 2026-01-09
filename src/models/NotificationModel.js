const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["school", "user", "system"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    role : {
        type : String,
        required : true
    }
  },
  { timestamps: true,versionKey:false }
);

 const notificationModel = mongoose.model("Notification", notificationSchema);

 module.exports = notificationModel;
