const router = require("express").Router();
const users = require("./users.controller");
const auth = require("../../middlewares/auth");

// routes
router.post("/", users.signup); // sign up
router.post("/login", users.login); // log in
router.get("/verify_email", users.verify_email); // verify email
router.patch("/change_password", auth.authenticate, users.change_password); // change password
router.patch("/change_email", auth.authenticate, users.change_email); // change email
router.delete("/", auth.authenticate, users.delete); // delete account

// admin routes
router.get("/", auth.authenticate, auth.authorize("admin"), users.read_all); // view all users
router.get("/:id", auth.authenticate, auth.authorize("admin"), users.read); // view all users

// export
module.exports = router;
