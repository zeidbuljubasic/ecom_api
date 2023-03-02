const API_Error = require("./../helpers/API_Error");

// ####################
// ERROR MIDDLEWARE
const error = (err, req, res, next) => {
	if (err.name == "TokenExpiredError") return res.status(401).json({ status: "fail", data: { message: "Session has expired, please log in again." } });
	if (err.name == "ValidationError") return res.status(400).json({ status: "fail", data: { message: err.errors[Object.keys(err.errors)[0]].message } });
	if (err.name == "CastError") return res.status(404).json({ status: "fail", data: { message: `${err.message.match(/for model \"(\w+)\"/)[1]} not found` } });
	if (err.code == 11000) return res.status(409).json({ status: "fail", data: { message: `${Object.keys(err.keyPattern)[0]} already exists in our database, please try something else` } });

	return res.status(err.status_code || 500).json({
		status: err.status || "error",
		data: {
			message: err.message,
		},
	});
};

module.exports = error;
