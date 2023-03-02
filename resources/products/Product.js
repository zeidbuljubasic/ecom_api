const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcryptjs");

// schema
const product_schema = new Schema({
	title: {
		type: String,
		required: [true, "Product title is required"],
		trim: true,
		minlength: 2,
		maxlength: 32,
	},

	description: {
		type: String,
		maxlength: 4000,
		default: "",
	},

	category: {
		type: String,
		default: "uncategorized",
		minlength: 2,
		maxlength: 32,
	},

	image: {
		type: String,
		default: "500.png",
	},

	price: {
		type: Number,
		required: [true, "Product price is required"],
	},

	stock: {
		type: Number,
		required: [true, "Stock quantity is required"],
		min: 0,
	},
});

// export
module.exports = model("Product", product_schema);
