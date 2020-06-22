import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Table, Breadcrumb, BreadcrumbItem } from 'reactstrap';

import s from './Dashboard.module.scss';

import { classAction } from '../../actions/class';
import { Role } from '../../constants';
import { generalUtils } from '../../core/utils';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { schoolsApi } from '../../core/api/schools';
import { coursesApi } from '../../core/api/courses';
import { classApi } from '../../core/api/class';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      isModalOpen: false,
      school_id: '',
      course_id: '',
      lecturer_id: '',
      semester: '20191',
      schools: [],
      courses: [],
      lecturers: [],
    };
  }

  componentDidMount() {
    this.fetchClasses();
  }

  fetchClasses() {
    if (Role.getAdminRoles().includes(this.props.auth.role)) {
      this.props.fetchAllClasses(this.state.page);
    } else {
      this.props.fetchClassesByLecturer(this.state.page);
    }
  }

  handlePageClick = (data) => {
    let selected = data.selected + 1;

    this.setState({ page: selected }, () => {
      this.fetchClasses();
    });
  };

  fetchSchools = () => {
    console.log('fetchSchools');
    schoolsApi.getSchools().then(
      (res) => {
        this.setState({ schools: res });
      },
      (error) => {
        this.setState({ schools: [] });
        generalUtils.showErrorNotification(error.message);
      },
    );
  };

  fetchCourses = () => {
    console.log('fetchCourses');
    const { school_id } = this.state;
    coursesApi.getCourses({ school_id }).then(
      (res) => {
        this.setState({ courses: res.data });
      },
      (error) => {
        this.setState({ courses: [] });
        generalUtils.showErrorNotification(error.message);
      },
    );
  };

  fetchLecturers = () => {
    console.log('fetchLecturers');
    const { school_id } = this.state;
    schoolsApi.getLecturers({ school_id }).then(
      (res) => {
        this.setState({ lecturers: res });
      },
      (error) => {
        this.setState({ courses: [] });
        generalUtils.showErrorNotification(error.message);
      },
    );
  };

  toggleModalOpen = () => {
    const isModalOpen = this.state.isModalOpen;

    if (!isModalOpen) {
      this.fetchSchools();
    } else {
      this.setState({ schools: [], courses: [], lecturers: [] });
    }

    this.setState({ isModalOpen: !isModalOpen });
  };

  handleSchoolSelection = (event) => {
    const school_id = parseInt(event.target.value) || '';

    this.setState({ school_id }, () => {
      if (school_id) {
        this.fetchCourses();
        this.fetchLecturers();
      }
    });
  };

  handleCourseSelection = (event) => {
    const course_id = parseInt(event.target.value) || '';

    this.setState({ course_id });
  };

  handleLecturerSelection = (event) => {
    const lecturer_id = parseInt(event.target.value) || '';

    this.setState({ lecturer_id });
  };

  handleSemesterInputChange = (event) => {
    this.setState({ semester: event.target.value });
  };

  handleSubmission = (event) => {
    event.preventDefault();

    classApi.createClass(this.state).then(
      (res) => {
        this.fetchClasses();
        this.toggleModalOpen();
        generalUtils.showSuccessNotification('New class created successfully !');
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  };

  render() {
    const pageCount = Math.ceil(this.props.totalItems / this.props.itemsPerPage);
    return (
      <div className={s.root}>
        <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem active>Classes</BreadcrumbItem>
      </Breadcrumb>
        <div style={{marginBottom: "20px"}}>
          <button className={`btn btn-info`} onClick={this.toggleModalOpen}>
            Add class
          </button>
        </div>
        <Table className={s.mainTable}>
          <thead>
            <tr>
              <th className="hidden-sm-down">Semester</th>
              <th>Class ID</th>
              <th>Course ID</th>
              <th>Course Name</th>
              <th className="hidden-sm-down">Lecturer</th>
              <th className="hidden-sm-down">Grade Submitted</th>
              <th className="hidden-sm-down">Grade Approved</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.classes.map((row) => (
              <tr key={row.id}>
                <td>{row.semester}</td>
                <td>
                  <Link to={'/home/classes/' + row.id}>{row.id}</Link>
                </td>
                <td>{row.course.id}</td>
                <td>{row.course.name}</td>
                <td>{row.lecturer.name}</td>
                <td>{generalUtils.parseDateTime(row.grade_submitted_time)}</td>
                <td>{generalUtils.parseDateTime(row.grade_approved_time)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />

        <Modal
          className={'register-success-modal'}
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModalOpen}
          backdrop={true}
          keyboard={true}
        >
          <ModalHeader toggle={this.toggleModalOpen}>Create a new class</ModalHeader>
          <ModalBody>
            <div>
              <form onSubmit={this.handleSubmission}>
                <div className="form-group">
                  <label>Semester</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Semester"
                    name="semester"
                    value={this.state.semester}
                    onChange={this.handleSemesterInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>School</label>
                  <select
                    value={this.state.school_id}
                    onChange={this.handleSchoolSelection}
                    className="form-control"
                    required
                  >
                    <option value="">Choose...</option>
                    {this.state.schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select
                    name={'course_id'}
                    value={this.state.course_id}
                    onChange={this.handleCourseSelection}
                    className="form-control"
                    required
                  >
                    <option value="">Choose...</option>
                    {this.state.courses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Lecturer</label>
                  <select
                    name={'lecturer_id'}
                    value={this.state.lecturer_id}
                    onChange={this.handleLecturerSelection}
                    className="form-control"
                    required
                  >
                    <option value="">Choose...</option>
                    {this.state.lecturers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <input value={'Submit'} type={'submit'} className="btn btn-primary" />
              </form>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    classes: state.classes.data,
    totalItems: state.classes.totalItems,
    itemsPerPage: state.classes.itemsPerPage,
    auth: state.auth,
  };
}

const mapDispatchToProps = {
  fetchAllClasses: classAction.fetchAllClasses,
  fetchClassesByLecturer: classAction.fetchClassesByLecturer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
