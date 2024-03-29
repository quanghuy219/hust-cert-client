import React from 'react';
import { verificationAction } from '../../actions/verification';
import { lcStorage } from '../../core/utils/localStorage';
import Certificate from '../certificate';
import { Table, Button } from 'reactstrap';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
import { generalUtils } from '../../core/utils';

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
      displayedCertificateID: null,
      student: {},
      access_token: '',
      enrollments: [],
      diplomas: [],
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
        diplomas: res.diplomas || [],
        renderPage: true,
      });
    })
    .catch(error => {
      generalUtils.showErrorNotification(error.message);
      this.props.history.push("/verification");
    });
  }

  componentWillUnmount() {
    lcStorage.delete('access_token');
  }

  openCertificateVerificationModal(certID, type = 'certificate') {
    this.setState({
      openModal: true,
      displayedCertificateID: certID,
    });
  }

  toggleCertificateVerificationModal() {
    this.setState((prevState) => {
      let newState = {
        openModal: !prevState.openModal,
      };
      if (prevState.openModal) {
        newState.displayedCertificateID = null;
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
        <p> Program: {this.state.student.program.name} </p>
        <p>School: {this.state.student.program.school.name}</p>
        <br/>
        <div>
          <h5>Transcript</h5>
          <Table>
            <thead>
              <tr>
                <th>Semester</th>
                <th>Course ID</th>
                <th>Course Name</th>
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
                  <td>{row.grade}</td>
                  <td style={{ width: '20%' }}>
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
        </div>

        <div>
          <h5>Diploma</h5>
          <Table>
            <thead>
              <tr>
                <th>Graduation year</th>
                <th>Degree</th>
                <th>Diploma</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.diplomas.map((row, index) => (
                <tr key={index}>
                  <td>{row.graduation_year}</td>
                  <td>{row.degree}</td>
                  <td style={{ width: '20%' }}>
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
        </div>

        <Certificate
          openModal={this.state.openModal}
          toggle={this.toggleCertificateVerificationModal}
          certificateID={this.state.displayedCertificateID}
          type="certificate"
        />
      </div>
    );
  }
}

export { Verification };
