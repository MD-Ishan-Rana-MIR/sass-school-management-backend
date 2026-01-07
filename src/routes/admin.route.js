const adminRoute = require("express").Router();

const adminOuth = require("../middlewares/admin.role.middleware");

const adminImgUpload = require("../config/adminImg");

const {
  createAdmin,
  loginAdmin,
  adminProfile,
  adminProfileUpdate,
} = require("../controllers/admin/admin.auth.controller");
const role = require("../middlewares/role.middleware");
const superAdminAuth = require("../middlewares/super.admin.role.middleware");

adminRoute.post(
  "/create-admin",
  superAdminAuth,
  role("super-admin"),
  adminImgUpload.single("image"),
  createAdmin
);

adminRoute.post("/admin-login", loginAdmin);

adminRoute.get(
  "/admin-profile",
  adminOuth,
  role("admin", "super-admin"),
  adminProfile
);

adminRoute.put(
  "/admin-profile-update",
  adminOuth,
  role("admin"),
  adminImgUpload.single("image"),
  adminProfileUpdate
);

module.exports = adminRoute;
