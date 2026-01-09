const notificationRouter = require("express").Router();
const superAdminAuth = require("../middlewares/super.admin.role.middleware");
const role = require("../middlewares/role.middleware");
const { allNotification, unreadNotification, readNotification, readAllNotification } = require("../controllers/notification/notification.controller");

notificationRouter.get("/all-notification",superAdminAuth,role("super-admin"), allNotification);
notificationRouter.get("/unread-notification",superAdminAuth,role("super-admin"), unreadNotification);
notificationRouter.put("/read-notification/:id",superAdminAuth,role("super-admin"), readNotification);
notificationRouter.put("/read-all-notification",superAdminAuth,role("super-admin"),readAllNotification);
module.exports = notificationRouter;