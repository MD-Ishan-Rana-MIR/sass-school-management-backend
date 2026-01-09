const { errorResponse, successResponse } = require("../../../config/response");
const superAdminModel = require("../../../models/SuperAdminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
exports.superAdminCreate = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existsEmail = await superAdminModel.findOne({ email: email });

    if (existsEmail)
      return errorResponse(res, 409, "Email already exists", null);

    const superAdmin = await superAdminModel.create({
      name,
      email,
      password,
    });
    return successResponse(
      res,
      201,
      "Super admin create successfully",
      superAdmin
    );
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await superAdminModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.SUPER_ADMIN_KEY,
      { expiresIn: "7d" }
    );

    // 🔐 SET TOKEN IN COOKIE (BEST)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "Super Admin Login Successfully", {
      data: {
        token: token,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.superAdminProfile = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await superAdminModel.findOne({ _id: id });

    return successResponse(res, 200, "Profile retrive successfully", {
      data: {
        name: user.name,
        email: user?.email,
        role: user?.role,
        img: user?.profileImg,
        createdAt: user?.createdAt,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Something went worng", error);
  }
};

exports.superAdminProfileUpdate = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Ensure a file was uploaded
    // if (!req.file?.filename) {
    //   return res.status(400).json({ message: "Profile image is required" });
    // }

    // Prepare the image path
    const imagePath = `/uploads/profiles/${req.file.filename}`;

    // Prepare update object
    const updateData = {
      profileImg: imagePath,
      email: email,
      name: name,
    };

    // Update the user in DB
    const updatedAdmin = await superAdminModel.findByIdAndUpdate(
      { _id: req.user.id },
      updateData,
      { new: true } // return the updated document
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "User not found" });
    }

    return successResponse(res, 200, "Profile update successfully", null);
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
};

exports.superAdminLogout = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await superAdminModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found ❌",
      });
    }

    // Clear the token cookie
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });


    return res.status(200).json({
      status: "success",
      message: "Super admin logged out successfully ✅",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong ❌",
      error,
    });
  }
};
