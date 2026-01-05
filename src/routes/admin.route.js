const adminRoute = require("express").Router();

const { createAdmin } = require("../controllers/admin/admin.auth.controller");
const role = require("../middlewares/role.middleware");

adminRoute.post("/create-admin", role("super-admin"), createAdmin);

module.exports = adminRoute;
