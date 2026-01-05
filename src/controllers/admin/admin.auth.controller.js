const { errorResponse, successResponse } = require("../../config/response");
const adminModel = require("../../models/AdminModel");

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, designation, schoolId } = req.body;
    if (!name || !email || !password || !designation || !schoolId)
      return errorResponse(res, 400, "All fields are required", null);

    const existsAdmin = await adminModel.findOne({ email });
    if (existsAdmin)
      return errorResponse(res, 409, "Admin already exists", null);

    const adminId = await generateAdminId();

    const admin = await adminModel.create({
      name,
      email,
      password,
      designation,
      schoolId,
      adminId,
    });

    return successResponse(res, 201, "Admin create successfully", {
      data: {
        id: admin._id,
        adminId: admin.adminId,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};
