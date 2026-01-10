const generateTeacherId = require("../../config/generateTeacherId");
const { errorResponse, successResponse } = require("../../config/response");
const teacherModel = require("../../models/TeacherModel");
require("dotenv").config();

exports.teacherUpload = async (req, res) => {
  try {
    const reqBody = req.body;
    const email = reqBody.email;

    if (!email) 
      return errorResponse(res, 400, "Email required", null);

    const isExistsEmail = await teacherModel.findOne({ email });
    if (isExistsEmail) 
      return errorResponse(res, 409, "This email already exists", null);

    const teacherId = await generateTeacherId();

    // Correct: pass payload directly to create
    const payload = {
      name: reqBody.name,
      email: email,
      password: reqBody.password, // you might want to hash it before saving
      designation: reqBody.designation,
      teacherId: teacherId,
      courseName: reqBody.courseName,
      education: reqBody.education,
    //   role: "teacher",
      department: reqBody.department,
    //   profileImg: reqBody.profileImg || "/uploads/img.jpg", // optional default
    //   isActive: reqBody.isActive !== undefined ? reqBody.isActive : true
    };

    const data = await teacherModel.create(payload); // ✅ pass payload directly

    return successResponse(res, 201, "Teacher created successfully",{data : {
        name : data?.name,
        email : data?.email,
        designation : data?.designation,
        teacherId : data?.teacherId,
        courseName : data?.courseName,
        education : data?.education,
        role : data?.role,
        isActive : data?.isActive,
        department : data?.department,
        profileImg : `${process.env.URL}${data?.profileImg}`,
        createdAt : data?.createdAt,
        _id : data?._id
    }});

  } catch (error) {
    return errorResponse(res, 500, "Something went wrong.", error.message);
  }
};



exports.updateTeacherStatus = async (req, res) => {
  try {
    const { id } = req.params;

    

    // Find teacher by teacherId
    const teacher = await teacherModel.findOne({ _id : id });
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found", null);
    }

    // Update status
    teacher.isActive = !teacher?.isActive;
    await teacher.save();

    return successResponse(res, 200, "Teacher status updated successfully",null);

  } catch (error) {
    return errorResponse(res, 500, "Something went wrong.", error.message);
  }
};

exports.allTeacher = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    let filter = {};

    // Search by name, email, designation, teacherId
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      filter = {
        $or: [
          { name: regex },
          { email: regex },
          { designation: regex },
          { teacherId: regex }
        ]
      };
    }

    const total = await teacherModel.countDocuments(filter);

    const data = await teacherModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Map each teacher to proper format
    const teachers = data.map(teacher => ({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      designation: teacher.designation,
      teacherId: teacher.teacherId,
      courseName: teacher.courseName,
      education: teacher.education,
      role: teacher.role,
      isActive: teacher.isActive,
      department: teacher.department,
      profileImg: `${process.env.URL || ""}${teacher.profileImg}`,
      createdAt: teacher.createdAt
    }));

    return successResponse(res, 200, "Teachers fetched successfully", {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      teachers
    });
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error.message);
  }
};
