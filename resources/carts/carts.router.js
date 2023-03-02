const router = require("express").Router();
const carts = require("./carts.controller");
const auth = require("../../middlewares/auth");

// routes
router.post("/:product_id/:quantity", auth.authenticate, carts.add_to_cart); // add to cart
router.get("/", auth.authenticate, carts.read); // read cart
router.delete("/:item_id", auth.authenticate, carts.delete_from_cart); // delete from cart

// export
module.exports = router;
