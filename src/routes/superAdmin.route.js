const {
  superAdminCreate,
  superAdminLogin,
  superAdminProfile,
} = require("../controllers/super-admin/auth/super.admin.auth.controller");

const router = require("express").Router();

const superAdminAuth = require("../middlewares/super.admin.role.middleware");
const role = require("../middlewares/role.middleware");

router.post("/create-super-admin", superAdminCreate);
router.post("/login-super-admin", superAdminLogin);

router.get(
  "/super-admin-profile",
  superAdminAuth,
  role("super-admin"),
  superAdminProfile
);

module.exports = router;
