const schoolModel = require("../models/SchoolModel");

const generateSchoolId = async (schoolName) => {
  console.log("school name is", schoolName);
  if (!schoolName || typeof schoolName !== "string") {
    throw new Error("School name is required to generate school ID");
  }

  const year = new Date().getFullYear().toString();
  const namePart = schoolName.trim().substring(0, 4).toUpperCase();

  const prefix = `${year}${namePart}`;

  const lastSchool = await schoolModel
    .findOne({ schoolId: { $regex: `^${prefix}` } })
    .sort({ schoolId: -1 });

  let sequence = 1;

  if (lastSchool?.schoolId) {
    const lastSeq = parseInt(lastSchool.schoolId.slice(-4), 10);
    sequence = lastSeq + 1;
  }

  const sequenceStr = sequence.toString().padStart(4, "0");

  return `${prefix}${sequenceStr}`;
};

module.exports = generateSchoolId;
