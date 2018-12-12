import React from "react";
import { Link } from "react-router-dom";

const Nav = props => {
	const { isAuthenticated, login, logout } = props.auth;
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/profile">Profile</Link>
				</li>
				<li>
					<Link to="/public">Public</Link>
				</li>
				{isAuthenticated() && (
					<li>
						<Link to="/secure">Secure</Link>
					</li>
				)}
				<li>
					<button onClick={isAuthenticated() ? logout : login}>
						{isAuthenticated() ? "Log out" : "Log in"}
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Nav;
