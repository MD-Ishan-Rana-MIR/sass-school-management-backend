const schoolModel = require("../models/SchoolModel");

const generateSchoolId = async (schoolName) => {
  const year = new Date().getFullYear().toString(); // 4-digit year
  const namePart = schoolName.substring(0, 4).toUpperCase(); // first 4 letters

  // Find existing schools with same prefix
  const prefix = `${year}${namePart}`;
  const lastSchool = await schoolModel
    .find({ schoolId: { $regex: `^${prefix}` } })
    .sort({ schoolId: -1 })
    .limit(1);

  let sequence = 1;
  if (lastSchool.length > 0) {
    // Get last 4 digits of last schoolId and increment
    const lastSeq = parseInt(lastSchool[0].schoolId.slice(-4));
    sequence = lastSeq + 1;
  }

  const sequenceStr = sequence.toString().padStart(4, "0"); // pad with zeros
  return `${prefix}${sequenceStr}`;
};

module.exports = generateSchoolId;
