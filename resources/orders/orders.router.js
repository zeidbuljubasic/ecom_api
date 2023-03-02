const router = require("express").Router();
const orders = require("./orders.controller");
const auth = require("../../middlewares/auth");

// admin routes
router.post("/:id/ship", auth.authenticate, auth.authorize("admin"), orders.ship); // mark order as shipped
router.get("/all", auth.authenticate, auth.authorize("admin"), orders.read_all_admin); // view all orders as admin
router.get("/all/:id", auth.authenticate, auth.authorize("admin"), orders.read_admin); // view specific order as admin

// routes
router.post("/", auth.authenticate, orders.create); // place order
router.get("/", auth.authenticate, orders.read_all); // read all orders
router.get("/:id", auth.authenticate, orders.read); // read order
router.post("/:id/cancel", auth.authenticate, orders.cancel); // cancel order

// export
module.exports = router;
