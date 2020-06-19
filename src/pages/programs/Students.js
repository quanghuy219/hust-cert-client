import React from 'react';
import { Table, FormGroup, Label, Input } from 'reactstrap';
import { programApi } from '../../core/api/program';
import { generalUtils } from '../../core/utils';
import Pagination from '../../components/Pagination';
import './style.css'

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.schoolInput = React.createRef();
    this.state = {
      programId: null,
      program: {},
      students: [],
      page: 1,
      totalItems: 0,
      itemsPerPage: 40,
      status: '',
      graduateQualified: "",
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    const programId = this.props.match.params.programID;
    this.setState(
      {
        programId: programId,
      },
      () => {
        this.fetchProgram();
        this.fetchProgramStudents();
      },
    );
  }

  handlePageClick = (data) => {
    let selected = data.selected + 1;

    this.setState({ page: selected }, () => {
      this.fetchProgramStudents();
    });
  };

  fetchProgram = () => {
    programApi.getProgramById(this.state.programId).then(
      (res) => {
        this.setState({
          program: res,
        });
      },
      (error) => {
        generalUtils.showErrorNotification(error.message || 'Failed to fetch program data');
      },
    );
  };

  fetchProgramStudents = () => {
		const { page, itemsPerPage, status } = this.state;
		let graduateQualified = "";
		if (this.state.graduateQualified) {
			graduateQualified = this.state.graduateQualified === 'true'
		}

    programApi
      .getStudents(this.state.programId, page, itemsPerPage, status, graduateQualified)
      .then(
        (res) => {
          this.setState({
            students: res.data,
            totalItems: res.total_items,
            itemsPerPage: res.items_per_page,
          });
        },
        (error) => {},
      );
	};
	
	setStudentFilter = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		}, () => {
			console.log(this.state)
			this.fetchProgramStudents()
		})
	}

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center filter-students">
          <FormGroup className="filter-input">
            <Label for="studentStatus">Status</Label>
            <Input type="select" name="status" id="studentStatus" onChange={this.setStudentFilter}>
              <option value="">All</option>
              <option value="studying">Studying</option>
              <option value="graduated">Graduated</option>
            </Input>
          </FormGroup>

					<FormGroup className="filter-input">
            <Label for="studentGraduationStatus">Qualify for graduate</Label>
            <Input type="select" name="graduateQualified" id="studentGraduationStatus" defaultValue={null} onChange={this.setStudentFilter}>
              <option value="">All</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </Input>
          </FormGroup>
        </div>

        <div className="table-students">
          <Table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Qualify for graduate</th>
              </tr>
            </thead>
            <tbody>
              {this.state.students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.status}</td>
                  <td>{student.graduate_qualified ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination handlePageClick={this.handlePageClick} itemsPerPage={this.state.itemsPerPage} totalItems={this.state.totalItems} />
        </div>
      </div>
    );
  }
}

export default Students;
