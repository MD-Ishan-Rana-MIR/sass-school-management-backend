const {
  superAdminCreate,
} = require("../controllers/super-admin/auth/super.admin.auth.controller");

const superAdminRoute = require("express").Router();

superAdminRoute.post("/create-super-admin", superAdminCreate);

module.exports = superAdminRoute;
