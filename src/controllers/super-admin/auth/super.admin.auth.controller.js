const { errorResponse } = require("../../../config/response");

exports.superAdminCreate = async (req, res) => {
  try {
    
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};
