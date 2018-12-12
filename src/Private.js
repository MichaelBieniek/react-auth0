import React, { Component } from "react";

class Private extends Component {
	state = {
		message: "",
	};

	componentDidMount() {
		fetch("/secure", {
			headers: {
				Authorization: `Bearer ${this.props.auth.getAccessToken()}`,
			},
		})
			.then(resp => {
				if (resp.ok) return resp.json();
				throw new Error("Network response error.");
			})
			.then(resp => this.setState({ message: resp.message }))
			.catch(err => this.setState({ message: err.message }));
	}

	render() {
		const { message } = this.state;
		return <p>{message}</p>;
	}
}

export default Private;
