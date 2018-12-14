import React, { Component } from "react";

class Courses extends Component {
	state = {
		courses: [],
	};

	componentDidMount() {
		fetch("/courses", {
			headers: {
				Authorization: `Bearer ${this.props.auth.getAccessToken()}`,
			},
		})
			.then(resp => {
				if (resp.ok) return resp.json();
				throw new Error("Network response error.");
			})
			.then(resp => this.setState({ courses: resp.courses }))
			.catch(err => this.setState({ message: err.message }));
	}

	render() {
		return (
			<ul>
				{this.state.courses.map(course => {
					return <li key={course.id}>{course.title}</li>;
				})}
			</ul>
		);
	}
}

export default Courses;
