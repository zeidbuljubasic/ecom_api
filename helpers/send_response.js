const send = (res, data, code, status) => {
	return res.status(code || 200).json({
		status: status || "success",
		data,
	});
};

module.exports = send;
