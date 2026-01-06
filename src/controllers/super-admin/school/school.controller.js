const generateSchoolId = require("../../../config/generateSchoolId");
const { errorResponse, successResponse } = require("../../../config/response");
const schoolModel = require("../../../models/SchoolModel");

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
    const schoolId = await generateSchoolId("ishan");

    const payload = {
      schoolName,
      schoolEmail,
      contactNumber,
      schoolLogo,
      schoolId,
    };

    const data = await schoolModel.create(payload);
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
