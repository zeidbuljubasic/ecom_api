const nodemailer = require("nodemailer");
const config = require("./../config.json");
const API_Error = require("./API_Error");

const send_email = async (to, subject, html) => {
	try {
		const transporter = nodemailer.createTransport({
			port: config.smtp.port,
			host: config.smtp.server,
			secure: true,
			auth: {
				user: config.smtp.user,
				pass: config.smtp.pass,
			},
		});

		const mail = await transporter.sendMail({
			from: config.smtp.from,
			to,
			subject,
			html,
		});

		return mail.messageId;
	} catch (err) {
		return err;
	}
};

module.exports = send_email;
