const userModel = require("../../models/UserModel");
const studentModel = require("../../models/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorResponse, successResponse } = require("../../config/response");

exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
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
      schoolId: user.schoolId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 🔐 SET TOKEN IN COOKIE (BEST)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    role: user.role,
    message: "Login successful",
  });
};

exports.studentCreate = async (req, res) => {
  try {
    const { name, roll, className, section, email, password } = req.body;
    const existsEmail = await studentModel.findOne({ email: email });
    if (existsEmail)
      return errorResponse(res, 409, "Email already exists", null);

    const existsRoll = await studentModel.findOne({ roll: roll });

    if (existsRoll)
      return errorResponse(res, 409, "Roll number is already exists", null);

    const student = await studentModel.create({
      name,
      roll,
      className,
      section,
      password,
      email,
      // schoolId: req.user.schoolId,
    });

    return successResponse(res, 201, "Student create successfully", student);
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};
