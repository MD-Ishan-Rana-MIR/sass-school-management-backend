const teacherRoute = require("express").Router();
const { teacherUpload, updateTeacherStatus, allTeacher } = require("../controllers/admin/admin.teacher.controller");
const roll = require("../middlewares/role.middleware");
const adminAuth = require("../middlewares/admin.role.middleware")


teacherRoute.post("/create-teacher", adminAuth,roll("admin"), teacherUpload);
teacherRoute.put("/teacher-status-update/:id",adminAuth,roll("admin"),updateTeacherStatus);
teacherRoute.get("/all-teacher",adminAuth,roll("admin"),allTeacher)






module.exports = teacherRoute;
