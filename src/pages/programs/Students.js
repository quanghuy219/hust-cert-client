import React from 'react';
import { connect } from 'react-redux';
import { Table, FormGroup, Label, Input, Button } from 'reactstrap';
import { programApi } from '../../core/api/program';
import { generalUtils } from '../../core/utils';
import { programAction } from '../../actions/program';
import Pagination from '../../components/Pagination';
import Certificate from '../certificate';
import { Role } from '../../constants';
import './style.css';

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
      graduateQualified: '',
      openModal: false,
      displayedCertificateID: null,
      displayedCertificateType: '',
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.toggleCertificateVerificationModal = this.toggleCertificateVerificationModal.bind(this);
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
    let graduateQualified = '';
    if (this.state.graduateQualified) {
      graduateQualified = this.state.graduateQualified === 'true';
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
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        this.fetchProgramStudents();
      },
    );
  };

  toggleCertificateVerificationModal() {
    this.setState((prevState) => {
      let newState = {
        openModal: !prevState.openModal,
      };
      if (prevState.openModal) {
        newState.displayedCertificateID = null;
        newState.displayedCertificateType = '';
      }
      return newState;
    });
  }

  openCertificateVerificationModal(certID, type) {
    this.setState({
      openModal: true,
      displayedCertificateID: certID,
      displayedCertificateType: type,
    });
  }

  createDiplomaTemplate = async () => {
    this.props.createDiplomaTemplates(this.state.programId).then((data) => {
      this.fetchProgramStudents();
    });
  };

  issueDiploma = () => {
    this.props.issueDiploma(this.state.programId).then((data) => {
      this.fetchProgramStudents();
    });
  };

  render() {
    return (
      <div>
        <div>
          <Button
            className="create-diploma-buttons"
            color="info"
            onClick={this.createDiplomaTemplate}
          >
            Create Raw Diploma
          </Button>

          {this.props.auth.role === Role.SUPER_ADMIN && (
            <Button className="create-diploma-buttons" color="info" onClick={this.issueDiploma}>
              Issue Diploma
            </Button>
          )}
        </div>

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
            <Input
              type="select"
              name="graduateQualified"
              id="studentGraduationStatus"
              defaultValue={null}
              onChange={this.setStudentFilter}
            >
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
                <th>Raw diploma</th>
                <th>Digital diploma</th>
              </tr>
            </thead>
            <tbody>
              {this.state.students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.status}</td>
                  <td>{student.graduate_qualified ? 'Yes' : 'No'}</td>
                  <td>
                    {student?.diploma?.certificate && student?.diploma?.certificate.template_url && (
                      <Button
                        color="info"
                        onClick={() =>
                          this.openCertificateVerificationModal(
                            student.diploma.certificate.id,
                            'template',
                          )
                        }
                      >
                        Display
                      </Button>
                    )}
                  </td>
                  <td>
                    {student?.diploma?.certificate && student?.diploma?.certificate.url && (
                      <Button
                        color="info"
                        onClick={() =>
                          this.openCertificateVerificationModal(
                            student.diploma.certificate.id,
                            'certificate',
                          )
                        }
                      >
                        Verify
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Certificate
            openModal={this.state.openModal}
            toggle={this.toggleCertificateVerificationModal}
            certificateID={this.state.displayedCertificateID}
            type={this.state.displayedCertificateType}
          />

          <Pagination
            handlePageClick={this.handlePageClick}
            itemsPerPage={this.state.itemsPerPage}
            totalItems={this.state.totalItems}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

const mapDispatchToProps = {
  createDiplomaTemplates: programAction.createDiplomaTemplates,
  issueDiploma: programAction.issueDiploma,
};

export default connect(mapStateToProps, mapDispatchToProps)(Students);
