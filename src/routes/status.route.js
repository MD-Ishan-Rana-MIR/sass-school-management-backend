const statusRoute = require("express").Router();
const { monthlySchoolGrowth, yearlySchoolGrowth, monthlyAdminlGrowth } = require("../controllers/super-admin/status/status.controller");
const role = require("../middlewares/role.middleware");
const superAdminAuth = require("../middlewares/super.admin.role.middleware");

statusRoute.get("/monthly-school-groth",superAdminAuth,role("super-admin"), monthlySchoolGrowth);
statusRoute.get("/yearly-school-groth",superAdminAuth,role("super-admin"), yearlySchoolGrowth);
statusRoute.get("/monthly-admin-groth",superAdminAuth,role("super-admin"), monthlyAdminlGrowth);

module.exports = statusRoute;