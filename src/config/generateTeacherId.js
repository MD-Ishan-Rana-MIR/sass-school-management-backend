const teacherModel = require("../models/TeacherModel");

const generateTeacherId = async () => {
  const now = new Date();

  const year = now.getFullYear(); // YYYY
  const day = String(now.getDate()).padStart(2, "0"); // DD

  const prefix = `${year}${day}`;

  // Find last teacher created today
  const lastTeacher = await teacherModel
    .findOne({
      teacherId: { $regex: `^${prefix}` },
    })
    .sort({ teacherId: -1 })
    .select("teacherId");

  let sequence = 1;

  if (lastTeacher) {
    const lastSeq = parseInt(lastTeacher.teacherId.slice(-4));
    sequence = lastSeq + 1;
  }

  const seqStr = String(sequence).padStart(4, "0");

  return `${prefix}${seqStr}`;
};

module.exports = generateTeacherId;
