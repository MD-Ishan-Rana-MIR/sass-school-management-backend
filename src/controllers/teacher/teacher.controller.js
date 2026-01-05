const { errorResponse, successResponse } = require("../../config/response");

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, designation, courseName, education } =
      req.body;
    // Basic validation

    if (
      !name ||
      !email ||
      !password ||
      !designation ||
      !courseName ||
      !education
    )
      return errorResponse(res, 400, "All Fields are required", null);

    // Check email uniqueness

    const existingTeacher = await teacherModel.findOne({ email });

    if (existingTeacher)
      return errorResponse(
        res,
        409,
        "Teacher already exists with this email",
        null
      );

    const teacherId = await generateTeacherId();

    const teacher = await teacherModel.create({
      name,
      email,
      password,
      designation,
      teacherId,
      courseName,
      education,
    });

    return successResponse(res, 201, "Teacher created successfully", {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      teacherId: teacher.teacherId,
    });
  } catch (error) {
    errorResponse(res, 500, "Something went wrong", error);
  }
};
