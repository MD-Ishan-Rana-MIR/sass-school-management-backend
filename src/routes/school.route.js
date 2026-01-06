const schoolRoute = require("express").Router();

const schoolLogoUpload = require("../config/schoolLogoUpload");
const {
  createSchool,
  allSchool,
} = require("../controllers/super-admin/school/school.controller");
const roll = require("../middlewares/role.middleware");
const superAdminRole = require("../middlewares/super.admin.role.middleware");

schoolRoute.post(
  "/school-create",
  superAdminRole,
  roll("super-admin"),
  schoolLogoUpload.single("schoolLogo"),
  createSchool
);

schoolRoute.get("/all-school", superAdminRole, roll("super-admin"), allSchool);

module.exports = schoolRoute;
