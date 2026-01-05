const adminModel = require("../models/AdminModel");

const generateAdminId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADMIN${year}`;

  const lastAdmin = await adminModel
    .findOne({
      adminId: { $regex: `^${prefix}` },
    })
    .sort({ adminId: -1 })
    .select("adminId");

  let sequence = 1;

  if (lastAdmin) {
    sequence = parseInt(lastAdmin.adminId.slice(-4)) + 1;
  }

  return `${prefix}${String(sequence).padStart(4, "0")}`;
};

module.exports = generateAdminId;
