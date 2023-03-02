// modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const API_Error = require("./helpers/API_Error");
const error = require("./middlewares/error");

// config
const config = require("./config.json");

// global middlewares
app.use(express.json());
app.use(cors());

// resources
const users = require("./resources/users/users.router");
const products = require("./resources/products/products.router");
const orders = require("./resources/orders/orders.router");
const carts = require("./resources/carts/carts.router");
const analytics = require("./resources/analytics/analytics.router");

// routers
app.use("/users", users);
app.use("/products", products);
app.use("/orders", orders);
app.use("/carts", carts);
app.use("/analytics", analytics);

// serving uploaded static files
app.use("/uploads", express.static("./uploads"));

// error middleware
app.all("*", (req, res, next) => next(new API_Error("Resource not found", 404)));
app.use(error);

// database
mongoose.set("strictQuery", false);
mongoose.set("autoIndex", true);
mongoose.connect(config.db.url);

// server
app.listen(config.app.port, () => console.log(`Listening on ${config.app.port}...`));
