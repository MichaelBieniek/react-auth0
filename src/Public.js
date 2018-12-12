import React, { Component } from "react";

class Public extends Component {
	state = {
		message: "",
	};

	componentDidMount() {
		fetch("/public")
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

export default Public;
