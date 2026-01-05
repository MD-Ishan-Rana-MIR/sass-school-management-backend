const {
  studentCreate,
  studentLogin,
} = require("../controllers/student/student.controller");

const studentRouter = require("express").Router();

// studentRouter.use(auth, role("admin", "teacher"));

studentRouter.post("/create-student", studentCreate);
studentRouter.post("/student-login", studentLogin);

module.exports = studentRouter;
