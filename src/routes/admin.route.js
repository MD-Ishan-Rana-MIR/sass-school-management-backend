const adminRoute = require("express").Router();

const adminOuth = require("../middlewares/admin.role.middleware");

const adminImgUpload = require("../config/adminImg");

const {
  loginAdmin,
  adminProfile,
  adminProfileUpdate,
  AdminLogout,
} = require("../controllers/admin/admin.auth.controller");

const role = require("../middlewares/role.middleware");
const superAdminAuth = require("../middlewares/super.admin.role.middleware");

const {
  createAdmin,
  allAdmin,
  singleAdmin,
  deleteAdmin,
  updateAdmin,
  adminStatusUpdate,
} = require("../controllers/super-admin/admin/admin.by.super.admin.controller");

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

// all admin by super admin

adminRoute.get(
  "/all-admin-by-super-admin",
  superAdminAuth,
  role("super-admin"),
  allAdmin
);

adminRoute.get(
  "/singleAdmin/:id",
  superAdminAuth,
  role("super-admin"),
  singleAdmin
);

adminRoute.delete(
  "/deleteAdmin/:id",
  superAdminAuth,
  role("super-admin"),
  deleteAdmin
);

adminRoute.put(
  "/admin-update/:id",
  superAdminAuth,
  role("super-admin"),
  adminImgUpload.single("image"),
  updateAdmin
);

adminRoute.put(
  "/admin-status-update/:id",
  superAdminAuth,
  role("super-admin"),
  adminStatusUpdate
);

// admin logout 
adminRoute.get("/admin-logout",adminOuth,role("admin"),AdminLogout);

module.exports = adminRoute;
