const config = require("../../config.json");
const send_response = require("../../helpers/send_response");
const async_try = require("../../helpers/async_try");
const API_Error = require("../../helpers/API_Error");
const Order = require("./Order");
const Cart = require("./../carts/Cart");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const _ = require("lodash");

// place order
exports.create = async_try(async (req, res, next) => {
	req.body = _.pick(req.body, ["shipping_information"]);

	const cart = await Cart.findOne({ user_id: req.user.id });
	const items = cart.items;

	if (items.length < 1) return next(new API_Error("Cannot place order because your carts is empty", 400));

	const order = await Order.create({
		user_id: req.user.id,
		items: items,
		shipping_information: req.body.shipping_information,
	});

	await Cart.findOneAndUpdate({ user_id: req.user.id }, { items: [] });

	send_response(res, order);
});

// read all orders
exports.read_all = async_try(async (req, res, next) => {
	const orders = await Order.find({ user_id: req.user.id });

	if (orders.length < 1) return next(new API_Error("You have not made any orders yet", 404));

	send_response(res, orders);
});

// read order
exports.read = async_try(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) return next(new API_Error("Cannot find order with given ID", 404));
	if (order.user_id != req.user.id) return next(new API_Error("This is not your order"));

	send_response(res, order);
});

// cancel order
exports.cancel = async_try(async (req, res, next) => {
	let order = await Order.findById(req.params.id);

	if (!order) return next(new API_Error("Cannot find order with given ID", 404));
	if (order.status != "processing") return next(new API_Error("This order cannot be canceled because it is shipped or already canceled"));
	if (order.user_id != req.user.id) return next(new API_Error("This order is not yours, so it cannot be updated by you"));

	order = await Order.findByIdAndUpdate(req.params.id, { status: "canceled" }, { new: true });

	send_response(res, order);
});

// #############################################
// #############################################
// admin
// #############################################
// #############################################

// ship order
exports.ship = async_try(async (req, res, next) => {
	let order = await Order.findOneAndUpdate({ _id: req.params.id, status: "processing" }, { status: "shipped" }, { new: true });

	if (!order) return next(new API_Error("Cannot find order with given ID, or found order is already shipped / canceled", 404));

	send_response(res, order);
});

// view all orders
exports.read_all_admin = async_try(async (req, res, next) => {
	const orders = await Order.find({});

	send_response(res, orders);
});

// view specific order
exports.read_admin = async_try(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) return next(new API_Error("No order with given ID", 404));

	send_response(res, order);
});
