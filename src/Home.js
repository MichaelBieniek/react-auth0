import React from "react";
import { Link } from "react-router-dom";

const Home = props => {
	const { auth } = props;

	return (
		<div>
			<h1>Home</h1>
			{auth.isAuthenticated() ? (
				<Link to="/profile">View Profile</Link>
			) : (
				<button onClick={props.auth.login}>Log In</button>
			)}
		</div>
	);
};

export default Home;
