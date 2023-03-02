const config = require("../../config.json");
const send_response = require("../../helpers/send_response");
const async_try = require("../../helpers/async_try");
const API_Error = require("../../helpers/API_Error");
const Product = require("./Product");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const _ = require("lodash");

// read all products
exports.read_all = async_try(async (req, res, next) => {
	if (req.query.s) {
		req.query.name = {
			$regex: req.query.s,
			$options: "i",
		};
	}

	let filter = { ...req.query };
	const excluded_filters = ["page", "sort", "limit", "fields", "s"];
	excluded_filters.forEach((excluded_filter) => delete filter[excluded_filter]);
	filter = JSON.stringify(filter).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

	const products = await Product.find(JSON.parse(filter)).limit(req.query.limit || 10);
	if (products.length < 1) return next(new API_Error("No products", 404));

	send_response(res, products);
});

// read product
exports.read = async_try(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) return next(new API_Error("Cannot find product with given ID", 404));

	send_response(res, product);
});

// ###########################################
// ###########################################
// admin
// ###########################################
// ###########################################

// delete product
exports.delete = async_try(async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);

	if (!product) return next(new API_Error("No product with given ID", 404));

	send_response(res, product);
});

// update product
exports.update = async_try(async (req, res, next) => {
	req.body = _.pick(req.body, ["title", "description", "category", "price", "stock"]);

	const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

	if (!product) return next(new API_Error("No product with given ID", 404));

	send_response(res, product);
});

// create product
exports.create = async_try(async (req, res, next) => {
	const product = await Product.create({
		title: req.body.title,
		description: req.body.description || "",
		category: req.body.category || "uncategorized",
		price: req.body.price,
		stock: req.body.stock,
		image: req.file ? req.file.filename : "500.png",
	});

	send_response(res, product);
});
