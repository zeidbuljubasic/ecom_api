const router = require("express").Router();
const analytics = require("./analytics.controller");
const auth = require("../../middlewares/auth");

// routes
router.get("/overview", auth.authenticate, auth.authorize("admin"), analytics.overview);

// export
module.exports = router;
