const {
  superAdminCreate,
  superAdminLogin,
  superAdminProfile,
  superAdminProfileUpdate,
} = require("../controllers/super-admin/auth/super.admin.auth.controller");

const router = require("express").Router();

const superAdminAuth = require("../middlewares/super.admin.role.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../config/imgUpload");

router.post("/create-super-admin", superAdminCreate);
router.post("/login-super-admin", superAdminLogin);

router.get(
  "/super-admin-profile",
  superAdminAuth,
  role("super-admin"),
  superAdminProfile
);

router.put(
  "/super-admin-profile-update",
  superAdminAuth,
  role("super-admin"),
  upload.single("image"),
  superAdminProfileUpdate
);

module.exports = router;
