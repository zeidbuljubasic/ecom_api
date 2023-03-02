const config = require("./../../config.json");
const send_response = require("./../../helpers/send_response");
const async_try = require("./../../helpers/async_try");
const API_Error = require("./../../helpers/API_Error");
const User = require("./User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Cart = require("./../carts/Cart");
const send_email = require("./../../helpers/send_email");
const _ = require("lodash");
const validator = require("validator");

// sign up
exports.signup = async_try(async (req, res, next) => {
	req.body = _.pick(req.body, ["name", "email", "password"]);

	const user = await User.create(req.body);

	const msg = `
	<h2>${user.name.split(" ")[0]}, you have to verify your email to be able to log in</h2>
	<p>To verify email, just hit this:
		<a href="${config.app.host}/users/verify_email?email=${user.email}">LINK</a>
	</p>`;

	const email = await send_email(user.email, "Your account is ready, but...", msg);

	send_response(res, { name: req.body.name, email: req.body.email });
});

// verify email
exports.verify_email = async_try(async (req, res, next) => {
	if (!req.query.email) return next(new API_Error("Invalid verification request", 400));

	const user = await User.findOneAndUpdate({ email: req.query.email }, { is_active: true });
	if (!user) return next(new API_Error("Invalid verification arguments", 400));

	const cart = await Cart.create({
		user_id: user.id,
		items: [],
	});

	res.send('<h2 style="color:green;">Email verified</h2>');
});

// log in
exports.login = async_try(async (req, res, next) => {
	req.body = _.pick(req.body, ["email", "password"]);

	const user = await User.findOne({ email: req.body.email });

	if (!user) return next(new API_Error("User not found", 404));

	if (!user.is_active) return next(new API_Error("You have to verify your email to log in, instructions are sent"));

	const is_pass_correct = await bcryptjs.compare(req.body.password, user.password);
	if (!is_pass_correct) return next(new API_Error("Incorrect password", 400));

	const token = await promisify(jwt.sign)({ id: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiry });

	send_response(res, { token });
});

// change password
exports.change_password = async_try(async (req, res, next) => {
	req.body = _.pick(req.body, ["current_password", "new_password"]);

	if (req.body.new_password.length < 6) return next(new API_Error("Password should be at least 6 characters long.", 400));

	const is_pass_correct = await bcryptjs.compare(req.body.current_password, req.user.password);
	if (!is_pass_correct) return next(new API_Error("Incorrect current password", 400));

	const new_password = await bcryptjs.hash(req.body.new_password, 8);
	const user = await User.findOneAndUpdate({ _id: req.user.id }, { password: new_password });

	const token = await promisify(jwt.sign)({ id: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiry });

	send_response(res, { message: "Password successfully changed, you're automatically logged in again", token });
});

// delete user
exports.delete = async_try(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.user.id);
	const cart = await Cart.findOneAndDelete({ user_id: req.user.id });

	send_response(res, user);
});

// change email
exports.change_email = async_try(async (req, res, next) => {
	req.body = _.pick(req.body, ["new_email"]);

	if (!validator.isEmail(req.body.new_email)) return next(new API_Error("This is not a valid email", 400));

	const user = await User.findByIdAndUpdate(req.user.id, { email: req.body.new_email, is_active: false }, { new: true });

	const msg = `
	<h2>${user.name.split(" ")[0]}, you have to verify your email to be able to log in</h2>
	<p>To verify email, just hit this:
		<a href="${config.app.host}:${config.app.port}/users/verify_email?email=${user.email}">LINK</a>
	</p>`;

	const email = await send_email(user.email, "Your account is ready, but...", msg);

	send_response(res, { name: user.name, email: user.email });
});

// #############################################
// #############################################
// admin
// #############################################
// #############################################

// view all users
exports.read_all = async_try(async (req, res, next) => {
	const users = await User.find({}).select("-__v -password");

	send_response(res, users);
});

// view specific user
exports.read = async_try(async (req, res, next) => {
	const user = await User.findById(req.params.id).select("-__v -password");

	if (!user) return next(new API_Error("No user with given ID", 404));

	send_response(res, user);
});
