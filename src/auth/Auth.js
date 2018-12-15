import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";

// Stored outside class since private
//eslint-disable-next-line
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

// use local storage for multiple tabs with ease

export default class Auth {
	constructor(history) {
		this.history = history;
		this.userProfile = null;
		this.requestedScopes = "openid profile email read:courses";
		this.auth0 = new auth0.WebAuth({
			domain: process.env.REACT_APP_AUTH0_DOMAIN,
			clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
			redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
			audience: process.env.REACT_APP_AUTH0_AUDIENCE,
			responseType: "token id_token",
			scope: this.requestedScopes,
		});
	}

	login = () => {
		localStorage.setItem(
			REDIRECT_ON_LOGIN,
			JSON.stringify(this.history.location),
		);
		// redirects user to login page
		this.auth0.authorize();
	};

	handleAuthentication = () => {
		// get data from URL
		this.auth0.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				// if access token, id token, create session
				this.setSession(authResult);
				const redirectLocation =
					localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
						? "/"
						: JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
				this.history.push(redirectLocation);
			} else if (err) {
				this.history.push("/");
				alert(
					`Error ${
						err.error
					}. Check the console for further details.`,
				);
				console.log(err);
			}
			localStorage.removeItem(REDIRECT_ON_LOGIN);
		});
	};

	setSession = authResult => {
		// set the time the access token will expire
		_expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
		_scopes = authResult.scopes || this.requestedScopes || "";

		_accessToken = authResult.accessToken;
		_idToken = authResult.idToken;
		this.scheduleTokenRenewal();
	};

	isAuthenticated() {
		return new Date().getTime() < _expiresAt;
	}

	logout = () => {
		this.auth0.logout({
			clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
			returnTo: "http://localhost:3000",
		});
	};

	getAccessToken = () => {
		if (!_accessToken) {
			throw new Error("No access token found.");
		}
		return _accessToken;
	};

	getProfile = cb => {
		if (this.userProfile) return cb(this.userProfile);
		this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
			if (profile) this.userProfile = profile;
			cb(profile, err);
		});
	};

	userHasScopes(scopes) {
		const grantedScopes = (_scopes || "").split(" ");
		return scopes.every(scope => grantedScopes.includes(scope));
	}

	// this is for SILENT AUTHENTICATION
	renewToken = cb => {
		this.auth0.checkSession({}, (err, result) => {
			if (err) {
				console.log(`Error: ${err.error} - ${err.error_description}.`);
			} else {
				this.setSession(result);
			}
			if (cb) cb(err, result);
		});
	};

	// for future scheduling of token renewal when token expires
	scheduleTokenRenewal() {
		const delay = _expiresAt - Date.now();
		if (delay > 0) setTimeout(() => this.renewToken(), delay);
	}
}
