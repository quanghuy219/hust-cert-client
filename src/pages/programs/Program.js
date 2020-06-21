import * as React from 'react';
import { useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link, Switch, Route } from 'react-router-dom';
import { default as Students } from './Students';
import { default as Curriculum } from './Curriculum';
import styled from 'styled-components';
import { Nav } from 'reactstrap';
import { programApi } from '../../core/api/program';
import { generalUtils } from '../../core/utils/general';

const Pages = {
  CURRICULUM: 'curriculum',
  STUDENTS: 'students',
};

const ProgramView = (props) => {
  const { url, path } = props.match;
  const { programID } = props.match.params;
  const fullUrl = props.location.pathname;
  const currentPage = fullUrl.replace(url, '').split`/`.join``; // split & join is a fallback for replaceAll
  const [currentProgramInfo, setCurrentProgramInfo] = useState('');

  useEffect(() => {
    programApi.getProgramById(programID).then(
      (res) => {
        setCurrentProgramInfo(res.school.name + ' / ' + res.name);
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  }, [programID]);

  return (
    <div className={props.className}>
      <Breadcrumb>
        <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
        <BreadcrumbItem active>{currentProgramInfo}</BreadcrumbItem>
      </Breadcrumb>

      <div className="nav-container">
        <Nav tabs>
          <li
            className={`${currentPage === Pages.CURRICULUM || currentPage === '' ? 'active' : ''}`}
          >
            <Link to={`${url}/curriculum`}>Curriculum</Link>
          </li>
          <li className={`${currentPage === Pages.STUDENTS ? 'active' : ''}`}>
            <Link to={`${url}/students`}>Students</Link>
          </li>
        </Nav>
      </div>
      <div className="main-content">
        <Switch>
          <Route path={`${path}`} exact component={Curriculum} />
          <Route path={`${path}/curriculum`} component={Curriculum} />
          <Route path={`${path}/students`} component={Students} />
        </Switch>
      </div>
    </div>
  );
};

export const Program = styled(ProgramView)`
  > .nav-container {
    > .nav {
      padding-left: 20px;

      > li {
        display: list-item;
        text-align: -webkit-match-parent;

        background-color: #f9f6f2;
        padding: 8px 10px;

        &.active {
          border: 1px solid transparent;
          border-top: 1px solid #cbcaca;
          border-left: 1px solid #cbcaca;
          border-right: 1px solid #cbcaca;
          border-bottom: 1px solid #f9f6f2;
          box-sizing: border-box;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          margin-bottom: -1px;
        }
      }
    }
  }

  .main-content {
    margin-top: 30px;
  }
`;
