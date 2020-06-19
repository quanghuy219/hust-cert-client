import React from 'react';
import { Link } from 'react-router-dom';
import {
  Label,
  Input,
  FormGroup,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from 'reactstrap';
import { programApi } from '../../core/api/program';
import { schoolsApi } from '../../core/api/schools';
import { generalUtils } from '../../core/utils';

class Programs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schools: [],
      programs: [],
      modalAddProgramOpen: false,
      selectedSchoolId: null,
      programName: '',
      page: 1,
      totalItems: 0,
      itemsPerPage: 20,
    };
  }

  componentDidMount() {
    this.fetchSchools();
  }

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

  fetchPrograms = () => {
    const { selectedSchoolId, programName, page, itemsPerPage } = this.state;
    console.log(selectedSchoolId)
    programApi.getPrograms(selectedSchoolId, programName, page, itemsPerPage).then(
      (res) => {
        this.setState({
          programs: res.data,
          totalItems: res.total_items,
          itemsPerPage: res.items_per_page,
        });
      },
      (error) => {},
    );
  };

  handleSelectSchool = (e) => {
    const selectedSchoolID = e.target.value;
    if (!selectedSchoolID) return;

    this.state.schools.forEach((school) => {
      if (parseInt(selectedSchoolID) === school.id) {
        this.setState({
          selectedSchoolId: school.id,
        }, () => {
          this.fetchPrograms();
        });
      }
    });
  };

  toggleModalAddProgram = () => {
    const modalAddProgramOpen = this.state.modalAddProgramOpen;
    this.setState({
      modalAddProgramOpen: !modalAddProgramOpen,
    });
  };

  submitNewProgram = (e) => {
    e.preventDefault();

    const form = e.target;
    const schoolId = form.schoolId.value;
    const programName = form.name.value;
    const degree = form.degree.name;

    programApi.createProgram(schoolId, programName, degree).then(
      (res) => {
        generalUtils.showSuccessNotification('New program has been created');
        this.fetchPrograms(schoolId);
        this.toggleModalAddProgram();
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  };

  render() {
    return (
      <div>
        <h3>Training Programs</h3>

        <div className="programs-header" style={{ width: '350px' }}>
          <FormGroup>
            <Label for="selectSchoolInput">Select school</Label>
            <Input
              type="select"
              name="select"
              id="selectSchoolInput"
              onChange={this.handleSelectSchool}
            >
              <option value="">Choose...</option>
              {this.state.schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </div>

        <div className="program-buttons" style={{ marginBottom: '20px' }}>
          <Button color="info" onClick={this.toggleModalAddProgram}>
            Add program
          </Button>
        </div>

        <div className="table-programs">
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Degree</th>
                <th>School</th>
              </tr>
            </thead>
            <tbody>
              {this.state.programs.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to={`/home/programs/${row.id}`}>{row.id}</Link>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.degree}</td>
                  <td>{row.school.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Modal
          className={'register-success-modal'}
          isOpen={this.state.modalAddProgramOpen}
          toggle={this.toggleModalAddProgram}
          backdrop={true}
          keyboard={true}
        >
          <Form onSubmit={this.submitNewProgram}>
            <ModalHeader toggle={this.toggleModalAddProgram}>Add a new program</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="newProgramSchoolInput">School</Label>
                <Input
                  type="select"
                  name="schoolId"
                  id="newProgramSchoolInput"
                  defaultValue={this.state.selectedSchool ? this.state.selectedSchool.id : null}
                  required
                >
                  <option value="">Select school...</option>
                  {this.state.schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="newProgramName">Name</Label>
                <Input
                  id="newProgramName"
                  type="text"
                  className="form-control"
                  placeholder="Program Name"
                  name="name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="newProgramDegree">Degree</Label>
                <Input
                  id="newProgramDegree"
                  type="text"
                  className="form-control"
                  placeholder="Program Degree"
                  name="degree"
                  required
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary">Submit</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Programs;
