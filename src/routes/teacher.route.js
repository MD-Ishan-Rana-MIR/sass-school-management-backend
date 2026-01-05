const teacherRoute = require("express").Router();
const { createTeacher } = require("../controllers/teacher/teacher.controller");
const roll = require("../middlewares/role.middleware");

teacherRoute.post("/create-teacher", roll("admin"), createTeacher);

module.exports = teacherRoute;
