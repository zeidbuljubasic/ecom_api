const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcryptjs");
const shipping_information = require("./shipping_information");

// schema
const order_schema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: [true, `"user_id" is required`],
	},

	status: {
		type: String,
		required: [true, "Order status is required"],
		default: "processing",
		enum: ["processing", "shipped", "canceled"],
	},

	items: {
		type: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: [true, "Item is required"],
				},

				quantity: {
					type: Number,
					required: [true, "Quantity is required"],
					min: 1,
				},
			},
		],
	},

	shipping_information: {
		type: shipping_information,
		required: [true, "Shipping information are required"],
	},

	created_at: {
		type: Number,
		default: Math.round(Date.now() / 1000),
	},
});

// export
module.exports = model("Order", order_schema);
