const schoolRoute = require("express").Router();

const schoolLogoUpload = require("../config/schoolLogoUpload");
const {
  createSchool,
  allSchool,
  updateSchool,
  schoolDetails,
  deleteSchool,
  schoolStatusUpdate,
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

schoolRoute.get(
  "/school-details/:id",
  superAdminRole,
  roll("super-admin"),
  schoolDetails
);

schoolRoute.put(
  "/school-update/:id",
  superAdminRole,
  roll("super-admin"),
  schoolLogoUpload.single("schoolLogo"),
  updateSchool
);

schoolRoute.delete(
  "/school-delete/:id",
  superAdminRole,
  roll("super-admin"),
  deleteSchool
);

schoolRoute.put("/school-status-update/:id", superAdminRole, roll("super-admin",),schoolStatusUpdate);

module.exports = schoolRoute;
