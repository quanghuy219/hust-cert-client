import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { classAction } from '../../actions/class';
import { classApi } from '../../core/api';
import { certificateAction } from '../../actions/certificate';
import { generalUtils } from '../../core/utils/general';
import { Role } from '../../constants';
import Certificate from '../certificate';
import './style.css';

class Enrollment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      updateGrade: false,
      classID: null,
      class: {
        enrollments: [],
      },
      modalOpen: false,
      certificate: null,
      certificateType: '',
      modalEnrollStudentOpen: false,
      studentID: null,
    };
    this.handleUpdateStudentGrade = this.handleUpdateStudentGrade.bind(this);
    this.submitGrades = this.submitGrades.bind(this);
    this.approveGrades = this.approveGrades.bind(this);
    this.createCertificateTemplate = this.createCertificateTemplate.bind(this);
    this.issueCertificates = this.issueCertificates.bind(this);
    this.toggleCertificateVerificationModal = this.toggleCertificateVerificationModal.bind(this);
    this.openCertificateVerificationModal = this.openCertificateVerificationModal.bind(this);
    this.enrollStudent = this.enrollStudent.bind(this);
    this.toggleModalEnrollStudentOpen = this.toggleModalEnrollStudentOpen.bind(this);
    this.onStudentIDInputChange = this.onStudentIDInputChange.bind(this);
  }

  componentDidMount() {
    const classID = this.props.match.params.classID;
    this.setState({
      classID: classID,
    });
    this.props.fetchClass(classID);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.class) {
      this.setState({
        class: nextProps.class,
        updateGrade: false,
      });
    }
  }

  handleUpdateStudentGrade(e, studentID, type) {
    let enrollments = Object.assign(this.state.class.enrollments);
    enrollments.forEach((element) => {
      if (element.student.id === studentID) {
        element[type] = e.target.value;
      }
    });
    let classData = Object.assign(this.state.class);
    classData.enrollments = enrollments;
    this.setState({
      class: classData,
    });
  }

  submitGrades() {
    const enrollments = this.state.class.enrollments;
    const grades = enrollments.map((e) => {
      return {
        student_id: e.student.id,
        midterm: e.midterm,
        final: e.final,
      };
    });
    this.props.submitGrades(this.state.classID, grades);
  }

  approveGrades() {
    this.props.approveGrades(this.state.classID);
  }

  createCertificateTemplate() {
    this.props.createCertificateTemplates(this.state.classID);
  }

  issueCertificates() {
    this.props.issueCertificates(this.state.classID);
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

  openCertificateVerificationModal(certID, type) {
    certificateAction.getCertificateContent(certID, type).then((data) => {
      this.setState({
        openModal: true,
        certificate: JSON.parse(data),
        certificateType: type,
      });
    });
  }

  enrollStudent() {
    const studentID = this.state.studentID;
    const classID = parseInt(this.state.classID);
    classApi.enrollStudent({ studentID, classID }).then(
      (res) => {
        generalUtils.showSuccessNotification(res.message);
        this.props.fetchClass(classID);
        this.toggleModalEnrollStudentOpen();
        this.setState({ studentID: null });
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  }

  toggleModalEnrollStudentOpen() {
    const modalEnrollStudentOpen = this.state.modalEnrollStudentOpen;
    this.setState({
      modalEnrollStudentOpen: !modalEnrollStudentOpen,
    });
  }

  onStudentIDInputChange(event) {
    this.setState({ studentID: event.target.value });
  }

  render() {
    return (
      <div>
        <h1 className="mb-lg">Class Details</h1>
        <Table borderless className="class-info">
          <tbody>
            <tr>
              <td>
                <p> Semester: {this.props.class.semester} </p>
                <p> Course: {this.props.class.course.name} </p>
                <p>
                  {' '}
                  School:{' '}
                  {this.props.class.course.school ? this.props.class.course.school.name : ''}{' '}
                </p>
                <p> Credits: {this.props.class.course.credits} </p>
              </td>
              <td>
                <p> Lecturer: {this.props.class.lecturer.name} </p>
                <p> Email: {this.props.class.lecturer.email} </p>
                <p>
                  {' '}
                  Grade Submitted Time:{' '}
                  {generalUtils.parseDate(this.props.class.grade_submitted_time)}{' '}
                </p>
                <p>
                  {' '}
                  Grade Approved Time:{' '}
                  {generalUtils.parseDate(this.props.class.grade_approved_time)}{' '}
                </p>
              </td>
              <td>
                <p>
                  {' '}
                  Certificate Templates Created Time:{' '}
                  {generalUtils.parseDate(this.props.class.certificate_template_created_time)}{' '}
                </p>
                <p>
                  {' '}
                  Certificate Created Time:{' '}
                  {generalUtils.parseDate(this.props.class.certificate_created_time)}{' '}
                </p>
              </td>
            </tr>
          </tbody>
        </Table>

        <div className="class-buttons">
          <Button color="info" onClick={this.toggleModalEnrollStudentOpen}>
            Add student
          </Button>

          {!this.state.updateGrade ? (
            <Button
              color="info"
              disabled={this.props.class.grade_approved}
              onClick={() => this.setState({ updateGrade: true })}
            >
              Update Grades
            </Button>
          ) : (
            <span>
              <Button
                color="info"
                disabled={this.props.class.grade_approved}
                onClick={this.submitGrades}
              >
                Submit
              </Button>
              <Button
                color="danger"
                disabled={this.props.class.grade_approved}
                onClick={() => this.setState({ updateGrade: false })}
              >
                Cancel
              </Button>
            </span>
          )}

          {Role.getAdminRoles().includes(this.props.auth.role) && (
            <Button
              color="info"
              disabled={this.props.class.grade_approved || !this.props.class.grade_submitted}
              onClick={this.approveGrades}
            >
              Approve Grades
            </Button>
          )}
          {Role.getAdminRoles().includes(this.props.auth.role) && (
            <Button
              color="info"
              disabled={!this.props.class.grade_approved}
              onClick={this.createCertificateTemplate}
            >
              Create Certificate Template
            </Button>
          )}
          {this.props.auth.role === Role.SUPER_ADMIN && (
            <Button
              color="info"
              disabled={!this.props.class.certificate_template_created}
              onClick={this.issueCertificates}
            >
              Issue Digital Certificate
            </Button>
          )}
        </div>
        <Table className="class-enrollments">
          <thead>
            <tr>
              <th className="hidden-sm-down">Student ID</th>
              <th>Student Name</th>
              <th>Midterm</th>
              <th>Final</th>
              <th className="hidden-sm-down">Grade</th>
              <th>Certificate Template</th>
              <th>Digital Certificate</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.class.enrollments.map((row) => (
              <tr key={row.student.id}>
                <td>{row.student.id}</td>
                <td>{row.student.name}</td>
                <td className="col-grade">
                  {this.state.updateGrade ? (
                    <Input
                      className="grade-input"
                      name="midterm"
                      value={row.midterm}
                      onChange={(e) => this.handleUpdateStudentGrade(e, row.student.id, 'midterm')}
                    />
                  ) : (
                    row.midterm
                  )}
                </td>
                <td className="col-grade">
                  {this.state.updateGrade ? (
                    <Input
                      className="grade-input"
                      name="final"
                      value={row.final}
                      onChange={(e) => this.handleUpdateStudentGrade(e, row.student.id, 'final')}
                    />
                  ) : (
                    row.final
                  )}
                </td>
                <td>{row.grade}</td>
                <td>
                  {row.certificate && row.certificate.template_url && (
                    <Button
                      color="info"
                      onClick={() =>
                        this.openCertificateVerificationModal(row.certificate.id, 'template')
                      }
                    >
                      Display
                    </Button>
                  )}
                </td>
                <td>
                  {row.certificate && row.certificate.url && (
                    <Button
                      color="info"
                      onClick={() =>
                        this.openCertificateVerificationModal(row.certificate.id, 'certificate')
                      }
                    >
                      Verify
                    </Button>
                  )}
                </td>
                <td></td>
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

        <Modal
          className={'register-success-modal'}
          isOpen={this.state.modalEnrollStudentOpen}
          toggle={this.toggleModalEnrollStudentOpen}
          backdrop={true}
          keyboard={true}
        >
          <ModalHeader toggle={this.toggleModalEnrollStudentOpen}>
            Add a student to class
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="number"
                className="form-control"
                placeholder="Student ID"
                name="studentid"
                onChange={this.onStudentIDInputChange}
                value={this.state.studentID?.toString() ?? ''}
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.enrollStudent}>
              Submit
            </Button>
            <Button color="error" onClick={this.toggleModalEnrollStudentOpen}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    class: state.classes.class,
    auth: state.auth,
  };
}

const mapDispatchToProps = {
  fetchClass: classAction.fetchClass,
  submitGrades: classAction.submitGrades,
  approveGrades: classAction.approveGrades,
  createCertificateTemplates: classAction.createCertificateTemplates,
  issueCertificates: classAction.issueCertificates,
};

export default connect(mapStateToProps, mapDispatchToProps)(Enrollment);
