const config = require("../../config.json");
const send_response = require("../../helpers/send_response");
const async_try = require("../../helpers/async_try");
const API_Error = require("../../helpers/API_Error");
const Cart = require("./Cart");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Product = require("./../products/Product");

// add to cart
exports.add_to_cart = async_try(async (req, res, next) => {
	const product = await Product.findById(req.params.product_id);

	if (!product) return next(new API_Error("Product you're trying to add to cart doesn't exist.", 400));
	if (product.stock < req.params.quantity) return next(new API_Error("Stock is low, try to lower item quantity.", 400));

	const cart = await Cart.findOneAndUpdate(
		{ user_id: req.user.id },
		{
			$push: {
				items: {
					product: req.params.product_id,
					quantity: req.params.quantity,
				},
			},
		},
		{ new: true }
	).select("-__v");

	send_response(res, cart);
});

// read cart
exports.read = async_try(async (req, res, next) => {
	const cart = await Cart.findOne({ user_id: req.user.id }).select("-__v");

	send_response(res, cart);
});

// delete item from cart
exports.delete_from_cart = async_try(async (req, res, next) => {
	let cart = await Cart.findOneAndUpdate({ user_id: req.user.id }, { $pull: { items: { _id: req.params.item_id } } }, { new: true }).select("-__v");

	send_response(res, cart);
});
