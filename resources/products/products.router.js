const router = require("express").Router();
const products = require("./products.controller");
const auth = require("../../middlewares/auth");
const multer = require("multer");
const path = require("path");

// multer config
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/products/");
	},
	filename: function (req, file, cb) {
		const timestamp = Math.round(new Date().getTime() / 1000);
		const extension = path.extname(file.originalname);
		cb(null, timestamp + extension);
	},
});

const upload = multer({ storage: storage });

// admin routes
router.delete("/:id", auth.authenticate, auth.authorize("admin"), products.delete);
router.patch("/:id", auth.authenticate, auth.authorize("admin"), products.update);
router.post("/", auth.authenticate, auth.authorize("admin"), upload.single("image"), products.create);

// routes
router.get("/", products.read_all); // read all products
router.get("/:id", products.read); // read product

// export
module.exports = router;
