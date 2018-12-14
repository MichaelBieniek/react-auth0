const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt"); // validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // retrieve RSA keys from JSON web key set (JKWS) endpoint
const checkScope = require("express-jwt-authz");

const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true, // cache the signing key
		rateLimit: true,
		jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
		jwksUri: `https://${
			process.env.REACT_APP_AUTH0_DOMAIN
		}/.well-known/jwks.json`,
	}),

	// validate the audience and the issuer
	audience: process.env.REACT_APP_AUTH0_AUDIENCE,
	issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

	// this must match the alg selected in Auth0 dashboard
	algorithms: ["RS256"],
});

const app = express();

app.get("/public", (req, res) => {
	res.json({
		message: "Hello from a public API!",
	});
});

app.get("/secure", checkJwt, (req, res) => {
	res.json({
		message: "Hello from a secured API!",
	});
});

app.get("/courses", checkJwt, checkScope(["read:courses"]), (req, res) => {
	res.json({
		courses: [{ id: 1, title: "Course 1" }, { id: 2, title: "Course 2" }],
	});
});

app.listen(3001, () => console.log("API started"));
