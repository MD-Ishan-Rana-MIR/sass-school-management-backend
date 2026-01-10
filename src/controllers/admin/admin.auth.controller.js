const generateAdminId = require("../../config/generateAdminId");
const { errorResponse, successResponse } = require("../../config/response");
const adminModel = require("../../models/AdminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await adminModel.findOne({ email });
    if (!user) return errorResponse(res, 404, "User not found", null);

    if (user.role == false)
      return errorResponse(
        res,
        400,
        "Admin inactive please contact super admin",
        null
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 401, "Invalid user", null);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ADMIN_KEY,
      { expiresIn: "7d" }
    );

    // 🔐 SET TOKEN IN COOKIE (BEST)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "Admin Login Successfully", {
      data: {
        token: token,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.adminProfile = async (req, res) => {
  const id = req.user.id;
  try {
    const filter = {
      _id: id,
    };

    const data = await adminModel.findOne(filter);

    return successResponse(
      res,
      200,
      "Admin profile retrive successfully",
      data
    );
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.adminProfileUpdate = async (req, res) => {
  const { name, designation, email, schoolId } = req.body;

  try {
    // Ensure a file was uploaded
    // if (!req.file?.filename) {
    //   return res.status(400).json({ message: "Profile image is required" });
    // }

    // Prepare the image path
    const imagePath = `/uploads/admins/${req.file.filename}`;

    // Prepare update object
    const updateData = {
      name: name,
      designation: designation,
      image: imagePath,
      email: email,
      schoolId: schoolId,
    };

    // Update the user in DB
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      { _id: req.user.id },
      updateData,
      { new: true } // return the updated document
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return successResponse(res, 200, "Profile update successfully", null);
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
};

exports.AdminLogout = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await adminModel.findById(userId);

    if (!user) return errorResponse(res,404,"Admin not found",null);

    // Clear the token cookie
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });


    return  successResponse(res,200,"Admin logout successfully",null);
  } catch (error) {
    console.error(error);
    return errorResponse(res,500,"Something went wrong",error.message);
  }
};
