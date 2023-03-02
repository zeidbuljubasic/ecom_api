const config = require("./../config.json");
const jwt = require("jsonwebtoken");
const API_Error = require("../helpers/API_Error");
const async_try = require("../helpers/async_try");
const User = require("../resources/users/User");
const { promisify } = require("util");

// authentication middleware
exports.authenticate = async_try(async (req, res, next) => {
	if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) return next(new API_Error("Please log in", 400));

	const token = await promisify(jwt.verify)(req.headers.authorization.split(" ")[1], config.jwt.secret);

	if (!token) return next(new API_Error("Invalid token", 400));

	const user = await User.findById(token.id);
	if (!user) return next(new API_Error("Please sign out and log in to your account again", 400));

	req.user = user;

	next();
});

exports.authorize = (role) =>
	async_try(async (req, res, next) => {
		if (req.user.role != role) return next(new API_Error("You are not allowed to do this", 401));

		req.is_admin = true;

		next();
	});
