const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcryptjs");
const random_string = require("./../../helpers/random_string");
const API_Error = require("../../helpers/API_Error");
const send_email = require("./../../helpers/send_email");
const config = require("./../../config.json");

// schema
const user_schema = new Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
		trim: true,
		minlength: 4,
		maxlength: 64,
	},

	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
		validate: [isEmail, "Wrong email format"],
		unique: true,
	},

	password: {
		type: String,
		required: [true, "Password is required"],
		minlength: [6, "Password should be at least 6 characters long."],
	},

	role: {
		type: String,
		default: "user",
	},

	is_active: {
		type: Boolean,
		default: false,
	},

	created_at: {
		type: Number,
		default: Math.round(Date.now() / 1000),
	},
});

// hashing password before creating user
user_schema.pre("save", async function (next) {
	this.password = await bcryptjs.hash(this.password, 8);

	next();
});

// export
module.exports = model("User", user_schema);
