const { errorResponse } = require("../../../config/response");

exports.createSchool = async (req, res) => {
  try {
    const { schoolName, schoolEmail, contactNumber } = req.body;
    const schoolLogo = `/uploads/schools/${req.file.filename}`;


    
    if (!schoolName || !schoolEmail || !contactNumber || !req.file?.filename)
      return errorResponse(res, 400, "All fields are required", null);









  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};
