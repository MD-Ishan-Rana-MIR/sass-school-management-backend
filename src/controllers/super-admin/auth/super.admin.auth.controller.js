const { errorResponse, successResponse } = require("../../../config/response");
const superAdminModel = require("../../../models/SuperAdminModel");

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
