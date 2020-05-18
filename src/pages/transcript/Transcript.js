import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Input } from 'reactstrap';

import { studentAction } from '../../actions/student';
import { certificateAction } from '../../actions/certificate';
import Certificate from '../certificate';

class Transcript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      certificate: null,
      certificateType: '',
    };
    this.toggleCertificateVerificationModal = this.toggleCertificateVerificationModal.bind(this);
    this.openCertificateVerificationModal = this.openCertificateVerificationModal.bind(this);
    this.downloadCertificate = this.downloadCertificate.bind(this);
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
        newState.certificate = null;
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

  downloadCertificate(certID) {
    certificateAction.downloadCertificateFile(certID);
  }

  render() {
    return (
      <div>
        <h1>Student Information</h1>
        <p> Student ID: {this.props.auth.id} </p>
        <p> Name: {this.props.auth.name} </p>
        <p> Email: {this.props.auth.email} </p>
        <h2 className="mb-lg">Transcript</h2>
        <Table>
          <thead>
            <tr>
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
                        style={{ 'margin-right': '20px' }}
                        onClick={() =>
                          this.downloadCertificate(row.certificate.id)
                        }
                      >
                        Download
                      </Button>

                      <Button
                        style={{ 'margin-right': '20px' }}
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
