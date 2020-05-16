import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import {
  Table,
} from 'reactstrap';

import s from './Dashboard.module.scss';

import { classAction } from '../../actions/class';
import { Role } from '../../constants'
import { generalUtils } from '../../core/utils';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    };
  }

  componentDidMount() {
    this.fetchClasses()
  }

  fetchClasses() {
    if (Role.getAdminRoles().includes(this.props.auth.role)) {
      this.props.fetchAllClasses(this.state.page)
    } else {
      this.props.fetchClassesByLecturer(this.state.page)
    }
  }

  handlePageClick = data => {
    let selected = data.selected + 1;

    this.setState({ page: selected }, () => {
      this.fetchClasses()
    });
  };

  render() {
    const pageCount = Math.ceil(this.props.totalItems / this.props.itemsPerPage);
    return (
      <div className={s.root}>
        <h1 className="mb-lg">Dashboard</h1>
        <Table borderless className={s.mainTable}>
          <thead>
            <tr>
              <th className="hidden-sm-down">Semester</th>
              <th>Class ID</th>
              <th>Course ID</th>
              <th>Course Name</th>
              <th className="hidden-sm-down">Lecturer</th>
              <th className="hidden-sm-down">Grade Submitted</th>
              <th className="hidden-sm-down">Grade Approved</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              this.props.classes.map(row =>
                <tr key={row.id}>
                  <td>{row.semester}</td>
                  <td><Link to={"/home/classes/" + row.id}>{row.id}</Link></td>
                  <td>{row.course.id}</td>
                  <td>{row.course.name}</td>
                  <td>{row.lecturer.name}</td>
                  <td>{generalUtils.parseDate(row.grade_submitted_time)}</td>
                  <td>{generalUtils.parseDate(row.grade_approved_time)}</td>
                </tr>,
              )
            }
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
    );
  }
}

function mapStateToProps(state) {
  return {
    classes: state.classes.data,
    totalItems: state.classes.totalItems,
    itemsPerPage: state.classes.itemsPerPage,
    auth: state.auth
  };
}

const mapDispatchToProps = {
  fetchAllClasses: classAction.fetchAllClasses,
  fetchClassesByLecturer: classAction.fetchClassesByLecturer
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
