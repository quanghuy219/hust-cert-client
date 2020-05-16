import React from 'react';
import { connect } from 'react-redux';
import {
	Table,
	Button,
	Input
} from 'reactstrap'

import { classAction } from '../../actions/class'
import { generalUtils } from '../../core/utils/general';
import { Role } from '../../constants'
import './style.css';

class Enrollment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			updateGrade: false,
			class: {
				enrollments: [],
			}
		};
	}

	componentDidMount() {
		const classID = this.props.match.params.classID;
		this.props.fetchClass(classID)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.class) {
			this.setState({
				class: nextProps.class
			})
		}
	}

	render() {
		return (
			<div>
				<h1 className="mb-lg">Class Details</h1>
				<Table borderless className="class-info">
					<tbody>
						<tr>
							<td>
								<p> Semester: {this.props.class.semester} </p>
								<p> Course: {this.props.class.course.name} </p>
								<p> School: {this.props.class.course.school} </p>
								<p> Credits: {this.props.class.course.credits} </p>
							</td>
							<td>
								<p> Lecturer: {this.props.class.lecturer.name} </p>
								<p> Email: {this.props.class.lecturer.email} </p>
								<p> Grade Submitted Time: {generalUtils.parseDate(this.props.class.grade_submitted_time) } </p>
								<p> Grade Approved Time: {generalUtils.parseDate(this.props.class.grade_approved_time)} </p>
							</td>
						</tr>
					</tbody>
				</Table>

				<div className="class-buttons">
					{
						(!this.state.updateGrade) ?
							<Button color="info" disabled={this.props.class.grade_approved} onClick={() => this.setState({updateGrade: true})} >Update Grades</Button> :
							(
							<span>
								<Button color="info" disabled={this.props.class.grade_approved} onClick={() => this.setState({updateGrade: true})} >Submit</Button>
								<Button color="danger" disabled={this.props.class.grade_approved} onClick={() => this.setState({updateGrade: false})} >Cancel</Button>
							</span>
							)
					}
					
					{Role.getAdminRoles().includes(this.props.auth.role) && <Button color="info" disabled={this.props.class.grade_approved || !this.props.class.grade_submitted} >Approve Grades</Button>}
				</div>

				<Table className="class-enrollments">
					<thead>
						<tr>
							<th className="hidden-sm-down">Student ID</th>
							<th>Student Name</th>
							<th>Midterm</th>
							<th>Final</th>
							<th className="hidden-sm-down">Grade</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{
							this.state.class.enrollments.map(row =>
								<tr key={row.student.id}>
									<td>{row.student.id}</td>
									<td>{row.student.name}</td>
									<td>
										{
											this.state.updateGrade ?
											<Input className="grade-input" /> :
											row.midterm
										}
									</td>
									<td>
									{
											this.state.updateGrade ?
											<Input className="grade-input" /> :
											row.final
										}
									</td>
									<td>{row.grade}</td>
								</tr>,
							)
						}
					</tbody>
				</Table>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		class: state.classes.class,
		auth: state.auth
	};
}

const mapDispatchToProps = {
	fetchClass: classAction.fetchClass,
}

export default connect(mapStateToProps, mapDispatchToProps)(Enrollment);
