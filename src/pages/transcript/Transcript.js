import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Input, Form } from 'reactstrap';

import { studentAction } from '../../actions/student';
import { certificateAction } from '../../actions/certificate';
import Certificate from '../certificate';

class Transcript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      certificate: {},
      certificateType: '',
      selectVerificationRequest: false,
      verificationRequest: {
        enrollments: new Set(),
        degrees: new Set(),
        verifier: '',
        duration: '',
      },
    };
    this.toggleCertificateVerificationModal = this.toggleCertificateVerificationModal.bind(this);
    this.openCertificateVerificationModal = this.openCertificateVerificationModal.bind(this);
    this.downloadCertificate = this.downloadCertificate.bind(this);
    this.submitVerificationRequest = this.submitVerificationRequest.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleVerifierEmail = this.handleVerifierEmail.bind(this);
    this.handleDurationTime = this.handleDurationTime.bind(this);
  }

  componentDidMount() {
    this.props.fetchStudentEnrollments();
  }

  toggleCertificateVerificationModal() {
    this.setState((prevState) => {
      let newState = {
        openModal: !prevState.openModal,
      };
      if (prevState.openModal) {
        newState.certificate = {};
        newState.certificateType = '';
      }
      return newState;
    });
  }

  openCertificateVerificationModal(certID, type = 'certificate') {
    certificateAction.getCertificateContent(certID, type).then((data) => {
      this.setState({
        openModal: true,
        certificate: JSON.parse(data),
        certificateType: type,
      });
    });
  }

  submitVerificationRequest() {
    let { verifier, enrollments, degrees, duration } = this.state.verificationRequest;
    enrollments = [...enrollments];
    degrees = [...degrees];
    studentAction.createVerificationRequest(verifier, enrollments, degrees, duration).then(() => {
      this.setState({
        selectVerificationRequest: false,
      });
    });
  }

  downloadCertificate(certID) {
    certificateAction.downloadCertificateFile(certID);
  }

  handleCheckbox(e, id, type) {
    let { verificationRequest } = this.state;
    if (e.target.checked) {
      if (type === 'enrollment') {
        verificationRequest.enrollments.add(id);
      } else {
        verificationRequest.degrees.add(id);
      }
    } else {
      if (type === 'enrollment') {
        verificationRequest.enrollments.delete(id);
      } else {
        verificationRequest.degrees.delete(id);
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

  render() {
    return (
      <div>
        <h1>Student Information</h1>
        <p> Student ID: {this.props.auth.id} </p>
        <p> Name: {this.props.auth.name} </p>
        <p> Email: {this.props.auth.email} </p>

        <div style={{ marginBottom: '20px' }}>
          {!this.state.selectVerificationRequest ? (
            <Button color="info" onClick={() => this.setState({ selectVerificationRequest: true })}>
              Let verifier access your records
            </Button>
          ) : (
            <div style={{ width: '300px' }}>
              <Form onSubmit={this.submitVerificationRequest}>
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
                  required="true"
                  onChange={this.handleVerifierEmail}
                />

                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter expiration time (in hours)"
                  required="true"
                  onChange={this.handleDurationTime}
                />
              </Form>
            </div>
          )}
        </div>
        <h2 className="mb-lg">Transcript</h2>
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

        <Certificate
          openModal={this.state.openModal}
          toggle={this.toggleCertificateVerificationModal}
          certificate={this.state.certificate}
          type={this.state.certificateType}
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
