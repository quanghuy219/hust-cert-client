import React from 'react';
import { verificationAction } from '../../actions/verification';
import { certificateAction } from '../../actions/certificate';
import { lcStorage } from '../../core/utils/localStorage';
import Certificate from '../certificate';
import { Table, Button } from 'reactstrap';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Verification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderPage: false,
      openModal: false,
      certificate: {},
      student: {},
      access_token: '',
      enrollments: [],
      degrees: [],
    };
    this.toggleCertificateVerificationModal = this.toggleCertificateVerificationModal.bind(this);
  }

  componentWillMount() {
    let code = this.props.match.params.shareCode;
    verificationAction.fetchStudentInformation(code).then((res) => {
      lcStorage.set('access_token', res.access_token);
      this.setState({
        student: res.student,
        access_token: res.access_token,
        enrollments: res.enrollments || [],
        degrees: res.degrees || [],
        renderPage: true,
      });
    });
  }

  componentWillUnmount() {
    lcStorage.delete('access_token');
  }

  openCertificateVerificationModal(certID, type = 'certificate') {
    certificateAction.getCertificateContent(certID, type).then((data) => {
      this.setState({
        openModal: true,
        certificate: JSON.parse(data),
      });
    });
  }

  toggleCertificateVerificationModal() {
    this.setState((prevState) => {
      let newState = {
        openModal: !prevState.openModal,
      };
      if (prevState.openModal) {
        newState.certificate = {};
      }
      return newState;
    });
  }

  render() {
    if (!this.state.renderPage) {
      return (
        <div className="sweet-loading">
          <ClipLoader css={override} size={50} color={'#123abc'} loading={!this.state.renderPage} />
        </div>
      );
    }
    
    return (
      <div>
        <h1>Student Information</h1>
        <p> Student ID: {this.state.student.id} </p>
        <p> Name: {this.state.student.name} </p>
        <p> Email: {this.state.student.email} </p>

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
            {this.state.enrollments.map((row, index) => (
              <tr key={index}>
                <td>{row.semester}</td>
                <td>{row.course.id}</td>
                <td>{row.course.name}</td>
                <td>{row.midterm}</td>
                <td>{row.final}</td>
                <td>{row.grade}</td>
                <td>
                  {row.certificate_id && (
                    <span>
                      <Button
                        style={{ marginRight: '20px' }}
                        color="info"
                        onClick={() => this.openCertificateVerificationModal(row.certificate_id)}
                      >
                        Display
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
          type="certificate"
        />
      </div>
    );
  }
}

export default Verification;
