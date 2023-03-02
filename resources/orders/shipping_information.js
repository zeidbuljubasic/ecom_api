const { Schema } = require("mongoose");

const shipping_information = new Schema({
	address: {
		type: String,
		required: [true, "Shipping address is required"],
		minlength: 6,
		maxlength: 128,
		trim: true,
	},

	city: {
		type: String,
		required: [true, "City is required"],
		minlength: 2,
		maxlength: 64,
		trim: true,
	},

	country: {
		type: String,
		required: [true, "Country is required (2-character country code)"],
		minlength: [2, "Country should be 2 characters long (country code)"],
		maxlength: [2, "Country should be 2 characters long (country code)"],
		trim: true,
	},

	state: {
		type: String,
		minlength: 2,
		maxlength: 32,
		trim: true,
		default: "none",
	},

	zip: {
		type: String,
		required: [true, "ZIP code is required"],
		minlength: 1,
		maxlength: 8,
		trim: true,
	},
});

module.exports = shipping_information;
