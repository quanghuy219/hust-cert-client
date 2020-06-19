import React from 'react';
import {
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { programApi } from '../../core/api/program';
import { schoolsApi } from '../../core/api/schools';
import { coursesApi } from '../../core/api/courses';
import { generalUtils } from '../../core/utils';
import ReactPaginate from 'react-paginate';
import ProgramHeader from './ProgramHeader';

class Curriculum extends React.Component {
  constructor(props) {
		super(props);
		this.schoolInput = React.createRef();
    this.state = {
      courses: [],
      programId: null,
      program: {},
      page: 1,
      totalItems: 0,
      itemsPerPage: 20,
			modalAddCourseOpen: false,
			schools: [],
			addedCourses: []
    };
  }

  componentDidMount() {
    const programId = this.props.match.params.programID;
    this.setState(
      {
        programId: programId,
      },
      () => {
        this.fetchProgram();
        this.fetchProgramCurriculum();
      },
    );
  }

  handlePageClick = (data) => {
    let selected = data.selected + 1;

    this.setState({ page: selected }, () => {
      this.fetchProgramCurriculum();
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

  fetchProgramCurriculum = () => {
    const page = this.state.page;
    programApi.getProgramCurriculum(this.state.programId, page).then(
      (res) => {
        this.setState({
          courses: res.courses,
          totalItems: res.total_items,
          itemsPerPage: res.items_per_page,
        });
      },
      (error) => {},
    );
	};
	
	fetchSchools = () => {
    schoolsApi.getSchools().then(
      (res) => {
        this.setState({
          schools: res,
        });
      },
      (error) => {},
    );
  };

  toggleModalAddCourse = () => {
    const modalAddCourseOpen = this.state.modalAddCourseOpen;
    this.setState({
      modalAddCourseOpen: !modalAddCourseOpen,
    });
  };

  addCourseToCurriculum = (e) => {
    e.preventDefault();

    const form = e.target;
    const courseId = form.courseId.value;

    programApi.addCourseToCurriculum(this.state.programId, courseId).then(
      (res) => {
        generalUtils.showSuccessNotification('New course has been added to this curriculum');
        this.fetchProgramCurriculum();
        this.toggleModalAddCourse();
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
	};

	findCoursesByName = (e) => {
		const courseName = e.target.value;
		coursesApi.getCourses({name: courseName, school_id: this.schoolInput.current.value}).then(
			(res) => {
				this.setState({
					addedCourses: res.data
				})
			}, (err) => {

			}
		)
	}

  render() {
    const itemsPerPage = this.state.itemsPerPage;
    const pageCount = Math.ceil(this.state.totalItems / itemsPerPage) || 1;

    return (
      <div>
        <div className="curriculum-buttons" style={{ marginBottom: '20px' }}>
          <Button color="info" onClick={this.toggleModalAddCourse}>
            Add Course
          </Button>
        </div>

        <Modal
          className={'register-success-modal'}
          isOpen={this.state.modalAddCourseOpen}
          toggle={this.toggleModalAddCourse}
          backdrop={true}
          keyboard={true}
        >
          <Form onSubmit={this.addCourseToCurriculum}>
            <ModalHeader toggle={this.toggleModalAddCourse}>Add a new program</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="schoolInput">School</Label>
                <Input
                  type="select"
                  name="schoolId"
									id="schoolInput"
									onFocus={() => {this.fetchSchools()}}
									innerRef={this.schoolInput}
                >
                  <option value="0" >Select school...</option>
                  {this.state.schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="courseInput">Course</Label>
                <Input
                  type="select"
                  name="courseId"
									id="courseInput"
									onFocus={this.findCoursesByName}
									required
                >
                  <option value="">Select course...</option>
                  {this.state.addedCourses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id + ' - ' + s.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>

            </ModalBody>
            <ModalFooter>
              <Button color="primary">Submit</Button>
            </ModalFooter>
          </Form>
        </Modal>

        {this.state.courses.length ? (
          <React.Fragment>
            <div className="table-courses">
              <Table>
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Name</th>
                    <th>Credits</th>
                    <th>School</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.name}</td>
                      <td>{course.credits}</td>
                      <td>{course.school.name}</td>
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
            </div>
          </React.Fragment>
        ) : (
          <p>Program curriculum is empty</p>
        )}
      </div>
    );
  }
}

export default Curriculum;
