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
