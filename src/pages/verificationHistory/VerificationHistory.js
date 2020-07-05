import React from 'react';
import { Table } from 'reactstrap';
import { generalUtils } from '../../core/utils/general';
import { studentAction } from '../../actions/student';

class VerificationHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifications: [],
    };
    this.toggleVerificationDetails = this.toggleVerificationDetails.bind(this);
  }

  componentDidMount() {
    studentAction.fetchStudentVerificationHistory().then((res) => {
      let verifications = res.map((row) => {
        return {
          enrollments: row.enrollments,
          diplomas: row.diplomas,
          id: row.id,
          expirationTime: generalUtils.parseDateTime(row.expiration_time),
          verifier: row.verifier,
          shareURL: generalUtils.generateSharedURL(row.share_code),
          showDetails: false,
        };
      });

      this.setState({
        verifications,
      });
    });
  }

  toggleVerificationDetails(id) {
    let { verifications } = this.state;
    let newState = verifications.map((row) => {
      if (row.id === id) {
        row.showDetails = !row.showDetails;
      } else {
        row.showDetails = false;
      }
      return row;
    });
    this.setState({
      verifications: newState,
    });
  }

  render() {
    return (
      <div>
        <h2>Your published transcript history</h2>
        <br />
        <Table hover>
          <thead>
            <tr>
              <th></th>
              <th>Expiration Time</th>
              <th>Verifier</th>
              <th>Share URL</th>
            </tr>
          </thead>
          <tbody>
            {this.state.verifications.map((row) => (
              <React.Fragment>
                <tr key={row.id} onClick={() => this.toggleVerificationDetails(row.id)}>
                  <td>
                    <span
                      className={
                        row.showDetails
                          ? 'glyphicon glyphicon-chevron-up'
                          : 'glyphicon glyphicon-chevron-down'
                      }
                    />
                  </td>
                  <td>{row.expirationTime}</td>
                  <td>{row.verifier}</td>
                  <td>{row.shareURL}</td>
                </tr>
                {row.showDetails && (
                  <>
                    {row.enrollments.length > 0 && (
                      <tr>
                        <td colSpan={6}>
                          <Table>
                            <caption>Transcript</caption>
                            <thead>
                              <tr>
                                <th>Semester</th>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.enrollments.map((enrollment, index) => (
                                <tr key={index}>
                                  <td>{enrollment.semester}</td>
                                  <td>{enrollment.course.id}</td>
                                  <td>{enrollment.course.name}</td>
                                  <td>{enrollment.grade}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    )}

                    {row.diplomas.length > 0 && (
                      <tr>
                        <td colSpan={6}>
                          <Table>
                          <caption>Diploma</caption>
                            <thead>
                              <tr>
                                <th>Graduation Year</th>
                                <th>Degree</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.diplomas.map((diploma, index) => (
                                <tr key={index}>
                                  <td>{diploma.graduation_year}</td>
                                  <td>{diploma.degree}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default VerificationHistory;
