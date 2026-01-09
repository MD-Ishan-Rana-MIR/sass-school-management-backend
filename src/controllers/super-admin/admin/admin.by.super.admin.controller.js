const generateAdminId = require("../../../config/generateAdminId");
const { errorResponse, successResponse } = require("../../../config/response");
const adminModel = require("../../../models/AdminModel");
const notificationModel = require("../../../models/NotificationModel");




exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, designation, schoolId } = req.body;
    const adminLogo = `/uploads/admins/${req.file.filename}`;
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
      image: adminLogo,
    });

    await notificationModel.create({
      title: "New admin Created",
      message: `${name} admin has been created successfully.`,
      type: "admin",
      role : req.user.role
    })

    return successResponse(res, 201, "Admin create successfully", {
      data: {
        id: admin._id,
        adminId: admin.adminId,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Something went wrong", error);
  }
};
exports.allAdmin = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const pipeline = [];

    // 🔍 Search by admin name & email
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // 🔗 Join school
    pipeline.push(
      {
        $lookup: {
          from: "schools",
          localField: "schoolId",
          foreignField: "schoolId", // ✅ correct
          as: "school",
        },
      },
      {
        $unwind: {
          path: "$school",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: perPage },
      {
        $project: {
          name: 1,
          email: 1,
          designation: 1,
          schoolId: 1,
          adminId: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          "school._id": 1,
          "school.schoolName": 1,
          "school.schoolLogo": 1,
          "school.schoolEmail": 1,
          "school.contactNumber": 1,
        },
      }
    );

    const admins = await adminModel.aggregate(pipeline);

    // 🔢 Count (same search filter)
    const countPipeline = [];
    if (search) {
      countPipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      });
    }
    countPipeline.push({ $count: "total" });

    const countResult = await adminModel.aggregate(countPipeline);
    const totalAdmins = countResult[0]?.total || 0;

    console.log(totalAdmins);

    res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        total: totalAdmins,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(totalAdmins / perPage),
      },
    });
  } catch (error) {
    errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.singleAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await adminModel.findById({ _id: id });

    if (!data) return errorResponse(res, 404, "Admin not found", null);

    return successResponse(res, 200, "Admin find successfully", {
      data: {
        isActive: data?.isActive,
        name: data?.name,
        role: data?.role,
        _id: data?._id,
        email: data?.email,
        designation: data?.designation,
        schoolId: data?.schoolId,
        adminId: data?.adminId,
        image: data?.image,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
      },
    });
  } catch (error) {
    errorResponse(res, 500, "Something went wrong", error);
  }
};

exports.updateAdmin = async (req, res) => {
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

    await notificationModel.create({
      title: "Admin update",
      message: `${name} admin has been updated successfully.`,
      type: "admin",
      role : req.user.role
    });

    return successResponse(res, 200, "Profile update successfully", null);
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
};

exports.deleteAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await adminModel.findByIdAndDelete({ _id: id });
    if (!data) return errorResponse(res, 404, "Admin not found", null);
    successResponse(res, 200, "Admin delete successfully", null);
    await notificationModel.create({
      title: "Admin update",
      message: `${data?.name} admin has been delete successfully.`,
      type: "admin",
      role : req.user.role
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Something went wrong", error);
  }
};
