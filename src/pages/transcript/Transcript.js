import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Input, Form } from 'reactstrap';

import { studentAction } from '../../actions/student';
import { certificateAction } from '../../actions/certificate';
import { studentApi } from '../../core/api/student';
import Certificate from '../certificate';
import VerificationInfoModal from './VerificationInfoModal';

class Transcript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      displayedCertificateID: null,
      displayedCertificateType: '',
      selectVerificationRequest: false,
      verificationRequest: {
        enrollments: new Set(),
        diplomas: new Set(),
        verifier: '',
        duration: '',
      },
      verificationModalOpen: false,
      verificationInfo: {},
      student: {},
    };
    this.toggleCertificateVerificationModal = this.toggleCertificateVerificationModal.bind(this);
    this.downloadCertificate = this.downloadCertificate.bind(this);
    this.submitVerificationRequest = this.submitVerificationRequest.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleVerifierEmail = this.handleVerifierEmail.bind(this);
    this.handleDurationTime = this.handleDurationTime.bind(this);
    this.toggleVerificationInfoModal = this.toggleVerificationInfoModal.bind(this);
  }

  componentDidMount() {
    this.fetchStudentData();
    this.props.fetchStudentEnrollments();
  }

  fetchStudentData() {
    studentApi.getStudentInfo().then((res) => {
      this.setState({
        student: res,
      });
    });
  }

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

  submitVerificationRequest(e) {
    e.preventDefault();
    let { verifier, enrollments, diplomas, duration } = this.state.verificationRequest;
    enrollments = [...enrollments];
    diplomas = [...diplomas];
    studentAction
      .createVerificationRequest(verifier, enrollments, diplomas, duration)
      .then((res) => {
        this.setState({
          selectVerificationRequest: false,
          verificationModalOpen: true,
          verificationInfo: {
            expirationTime: res.expiration_time,
            shareCode: res.share_code,
            verifier: res.verifier,
          },
        });
      });
  }

  downloadCertificate(certID) {
    certificateAction.downloadCertificateFile(certID);
  }

  handleCheckbox(e, id, type) {
    let verificationRequest = {};
    Object.assign(verificationRequest, this.state.verificationRequest);

    if (e.target.checked) {
      if (type === 'enrollment') {
        verificationRequest.enrollments.add(id);
      } else {
        verificationRequest.diplomas.add(id);
      }
    } else {
      if (type === 'enrollment') {
        verificationRequest.enrollments.delete(id);
      } else {
        verificationRequest.diplomas.delete(id);
      }
    }

    this.setState({
      verificationRequest: verificationRequest,
    });
  }

  handleVerifierEmail(e) {
    let { verificationRequest } = this.state;
    verificationRequest.verifier = e.target.value;
    this.setState({
      verificationRequest,
    });
  }

  handleDurationTime(e) {
    let { verificationRequest } = this.state;
    verificationRequest.duration = e.target.value;
    this.setState({
      verificationRequest,
    });
  }

  toggleVerificationInfoModal() {
    this.setState({
      verificationModalOpen: !this.state.verificationModalOpen,
    });
  }

  render() {
    return (
      <div>
        <h1>Student Information</h1>
        <p> Student ID: {this.state.student.id} </p>
        <p> Name: {this.state.student.name} </p>
        <p> Email: {this.state.student.email} </p>

        <div style={{ marginBottom: '20px' }}>
          {!this.state.selectVerificationRequest ? (
            <React.Fragment>
              <Button
                color="info"
                onClick={() => this.setState({ selectVerificationRequest: true })}
              >
                Public your transcript
              </Button>
              <br />
            </React.Fragment>
          ) : (
            <div style={{ width: '300px' }}>
              <Form onSubmit={this.submitVerificationRequest}>
                <p>Select courses that you want to publish grade and digital certificate</p>
                <span className="class-buttons" style={{ marginLeft: 0 }}>
                  <Button color="info" type="submit">
                    Submit
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => this.setState({ selectVerificationRequest: false })}
                  >
                    Cancel
                  </Button>
                </span>

                <Input
                  type="email"
                  style={{ margin: '10px 0' }}
                  placeholder="Enter verifier email"
                  required={true}
                  onChange={this.handleVerifierEmail}
                />

                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter expiration time (in hours)"
                  required={true}
                  onChange={this.handleDurationTime}
                />
              </Form>
            </div>
          )}
        </div>
        <div className="transcript-table">
          <h3 className="mb">Transcript</h3>
          <Table>
            <thead>
              <tr>
                {this.state.selectVerificationRequest && <th></th>}
                <th>Semester</th>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Midterm</th>
                <th>Final</th>
                <th className="hidden-sm-down">Grade</th>
                <th>Digital Certificate</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.enrollments.map((row) => (
                <tr key={row.id}>
                  {this.state.selectVerificationRequest && (
                    <td>
                      <Input
                        type="checkbox"
                        name="check"
                        onChange={(e) => this.handleCheckbox(e, row.id, 'enrollment')}
                      />
                    </td>
                  )}
                  <td>{row.semester}</td>
                  <td>{row.course.id}</td>
                  <td>{row.course.name}</td>
                  <td>{row.midterm}</td>
                  <td>{row.final}</td>
                  <td>{row.grade}</td>
                  <td>
                    {row.certificate && row.certificate.url && (
                      <span>
                        <Button
                          color="danger"
                          style={{ marginRight: '20px' }}
                          onClick={() => this.downloadCertificate(row.certificate.id)}
                        >
                          Download
                        </Button>

                        <Button
                          style={{ marginRight: '20px' }}
                          color="info"
                          onClick={() =>
                            this.openCertificateVerificationModal(row.certificate.id, 'certificate')
                          }
                        >
                          Verify
                        </Button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {this.state.student.diploma && this.state.student.status === 'graduated' && (
          <div className="transcript-table">
            <h3>Diploma</h3>
            <Table>
              <thead>
                <tr>
                  {this.state.selectVerificationRequest && <th></th>}
                  <th>Graduation Year</th>
                  <th>Degree</th>
                  <th>Diploma</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  {this.state.selectVerificationRequest && (
                    <td>
                      <Input
                        type="checkbox"
                        name="check"
                        onChange={(e) =>
                          this.handleCheckbox(e, this.state.student.diploma.id, 'diploma')
                        }
                      />
                    </td>
                  )}

                  <td>{this.state.student.diploma.graduation_year}</td>
                  <td>{this.state.student.diploma.degree}</td>
                  <td>
                    {this.state.student.diploma.certificate &&
                      this.state.student.diploma.certificate.url && (
                        <span>
                          <Button
                            color="danger"
                            style={{ marginRight: '20px' }}
                            onClick={() =>
                              this.downloadCertificate(this.state.student.diploma.certificate.id)
                            }
                          >
                            Download
                          </Button>

                          <Button
                            style={{ marginRight: '20px' }}
                            color="info"
                            onClick={() =>
                              this.openCertificateVerificationModal(
                                this.state.student.diploma.certificate.id,
                                'certificate',
                              )
                            }
                          >
                            Verify
                          </Button>
                        </span>
                      )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
        <Certificate
          openModal={this.state.openModal}
          toggle={this.toggleCertificateVerificationModal}
          certificateID={this.state.displayedCertificateID}
          type={this.state.displayedCertificateType}
        />

        <VerificationInfoModal
          openModal={this.state.verificationModalOpen}
          toggleModal={this.toggleVerificationInfoModal}
          verification={this.state.verificationInfo}
        />
      </div>
    );
  }
}

Transcript.defaultProps = {
  enrollments: [],
};

function mapStateToProps(state) {
  return {
    enrollments: state.student.enrollments,
    auth: state.auth,
  };
}

const mapDispatchToProps = {
  fetchStudentEnrollments: studentAction.fetchStudentEnrollments,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
