const generateSchoolId = require("../../../config/generateSchoolId");
const { errorResponse, successResponse } = require("../../../config/response");
const notificationModel = require("../../../models/NotificationModel");
const schoolModel = require("../../../models/SchoolModel");
require("dotenv").config();

exports.createSchool = async (req, res) => {
  try {
    const { schoolName, schoolEmail, contactNumber } = req.body;

    if (!schoolName || !schoolEmail || !contactNumber) {
      return errorResponse(res, 400, "All fields are required", null);
    }

    if (!req.file) {
      return errorResponse(res, 400, "Please upload a school logo", null);
    }

    const schoolLogo = `/uploads/schools/${req.file.filename}`;
    const schoolId = await generateSchoolId(schoolName);

    const payload = {
      schoolName,
      schoolEmail,
      contactNumber,
      schoolLogo : `${process.env.URL}${schoolLogo}`,
      schoolId,
    };

    const data = await schoolModel.create(payload);

    await notificationModel.create({
      title: "New School Created",
      message: `${schoolName} school has been created successfully.`,
      type: "school",
      role : req.user.role
    });

    return successResponse(res, 201, "School created successfully", data);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.allSchool = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query; // default page 1, limit 10
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    let filter = {};

    // Search by schoolName, schoolId, schoolEmail
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      filter = {
        $or: [
          { schoolName: regex },
          { schoolId: regex },
          { schoolEmail: regex },
        ],
      };
    }

    const total = await schoolModel.countDocuments(filter); // total matching documents
    const data = await schoolModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return successResponse(res, 200, "Schools fetched successfully", {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      schools: data,
    });
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.schoolDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = {
      _id: id,
    };

    const data = await schoolModel.findById({ _id: id });

    if (!data) return errorResponse(res, 404, "School not found", null);

    return successResponse(res, 200, "School find successfully", data);
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const { schoolName, schoolEmail, contactNumber } = req.body;
    const id = req.params.id;

    // Build payload dynamically
    const payload = {};
    if (schoolName) payload.schoolName = schoolName;
    if (schoolEmail) payload.schoolEmail = schoolEmail;
    if (contactNumber) payload.contactNumber = contactNumber;

    // Only update schoolLogo if a new file is uploaded
    if (req.file) {
      payload.schoolLogo = `/uploads/schools/${req.file.filename}`;
    }

    // Update school
    await schoolModel.findByIdAndUpdate(id, payload);

    await notificationModel.create({
      title: "School update successfully",
      message: `${schoolName} school has been updated successfully.`,
      type: "school",
      role : req.user.role
    });

    // if (!data) {
    //   return errorResponse(res, 404, "School not found", null);
    // }

    return successResponse(res, 200, "School updated successfully", null);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await schoolModel.findByIdAndDelete({ _id: id });
    if (!data) return errorResponse(res, 404, "School not fond", null);

     await notificationModel.create({
      title: "School delete successfully",
      message: `${data?.schoolName} school has been deleted successfully.`,
      type: "school",
      role : req.user.role
    });
    return successResponse(res, 200, "School delete successfully", data);
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.schoolStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    // find school by id
    const school = await schoolModel.findById(id);

    if (!school) return errorResponse(res,404,"School not found",null);

    // toggle status
    school.status = !school.status;

    await school.save();

    return successResponse(res,200,"Status update successfully",null);

  } catch (error) {
    return errorResponse(res,500,"Something went wrong",error.message);
  }
};