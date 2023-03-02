const config = require("../../config.json");
const send_response = require("../../helpers/send_response");
const async_try = require("../../helpers/async_try");
const API_Error = require("../../helpers/API_Error");
const User = require("./../users/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Cart = require("../carts/Cart");
const Order = require("./../orders/Order");
const Product = require("./../products/Product");
const send_email = require("../../helpers/send_email");
const _ = require("lodash");
const validator = require("validator");

// sales overview
exports.overview = async_try(async (req, res, next) => {
	if (!req.query.from || !req.query.to) return next(new API_Error("You have to provide period of time", 400));

	const from = Math.round(new Date(req.query.from).getTime() / 1000);
	const to = Math.round(new Date(req.query.to).getTime() / 1000 + 86400);

	const overview = await Order.aggregate([
		{
			$match: {
				status: { $in: ["processing", "shipped"] },
			},
		},
		{
			$match: {
				created_at: { $gte: from, $lte: to },
			},
		},
		{
			$unwind: "$items",
		},
		{
			$lookup: {
				from: "products",
				localField: "items.product",
				foreignField: "_id",
				as: "product",
			},
		},
		{
			$unwind: "$product",
		},
		{
			$group: {
				_id: null,
				gross: { $sum: { $multiply: ["$items.quantity", "$product.price"] } },
				orders: { $sum: 1 },
				products_sold: { $sum: "$items.quantity" },
			},
		},
	]);

	send_response(res, _.pick(overview[0], ["gross", "orders", "products_sold"]));
});
