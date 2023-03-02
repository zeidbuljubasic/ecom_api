const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

// schema
const cart_schema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
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
					default: 1,
				},
			},
		],
	},
});

// export
module.exports = model("Cart", cart_schema);
