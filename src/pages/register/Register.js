import React from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';
import { useState } from 'react';
import { accountAction } from '../../actions/account';
import { BASE_DOMAIN } from '../../core/configs/base';
import styled from 'styled-components';

const BASE_EMAIL = `@${BASE_DOMAIN}`;

const Types = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
};

const isValidEmail = (email) => {
  const regex = new RegExp(`^[a-zA-Z0-9.-]*@${BASE_DOMAIN}$`);
  return regex.test(email);
};

const defaultInfo = {
  name: '',
  major: '',
  email: BASE_EMAIL,
  school: '',
  department: '',
};

const Register = () => {
  const [type, setType] = useState(Types.STUDENT);

  const [info, setInfo] = useState(defaultInfo);

  const updateStudentInfo = ({ name, major }) => {
    let newInfo = {};

    if (typeof name !== 'undefined') {
      newInfo = {
        ...info,
        name,
      };
    }

    if (typeof major !== 'undefined') {
      newInfo = {
        ...info,
        major,
      };
    }

    setInfo(newInfo);
  };

  const updateLecturerInfo = ({ name, email, school, department }) => {
    let newInfo = {};

    if (typeof name !== 'undefined') {
      newInfo = {
        ...info,
        name,
      };
    }

    if (typeof email !== 'undefined') {
      newInfo = {
        ...info,
        email,
      };
    }

    if (typeof school !== 'undefined') {
      newInfo = {
        ...info,
        school,
      };
    }

    if (typeof department !== 'undefined') {
      newInfo = {
        ...info,
        department,
      };
    }

    setInfo(newInfo);
  };

  const handleTextChange = (event) => {
    const newInfo = {};
    newInfo[event.target.name] = event.target.value;

    if (typeof newInfo.email !== 'undefined') {
      if (newInfo.email === '') {
        newInfo.email = BASE_EMAIL;
      } else if (!isValidEmail(newInfo.email)) {
        event.preventDefault();
        return;
      }
    }

    if (type === Types.STUDENT) {
      updateStudentInfo(newInfo);
    } else {
      updateLecturerInfo(newInfo);
    }
  };

  const handleOnClick = () => {
    accountAction.registerStudentAccount(info);
    setInfo(defaultInfo);
  };

  const switchToStudent = () => {
    setType(Types.STUDENT);
    setInfo(defaultInfo);
  };

  const switchToLecturer = () => {
    setType(Types.LECTURER);
    setInfo(defaultInfo);
  };

  return (
    <View>
      <Breadcrumb>
        <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
        <BreadcrumbItem active>Register</BreadcrumbItem>
      </Breadcrumb>
      <h1 className="page-title mb-lg">Register</h1>
      <div className="switch-buttons">
        <button
          className={`student-btn btn ${type === Types.STUDENT ? 'btn-info' : 'btn-outline-info'}`}
          onClick={switchToStudent}
        >
          Student
        </button>
        <button
          className={`lecturer-btn btn ${
            type === Types.LECTURER ? 'btn-info' : 'btn-outline-info'
          }`}
          onClick={switchToLecturer}
        >
          Lecturer
        </button>
      </div>
      <div className="">
        {type === Types.STUDENT && (
          <div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
                onChange={handleTextChange}
                value={info.name || ''}
              />
            </div>
            <div className="form-group">
              <label>Major</label>
              <input
                type="text"
                className="form-control"
                placeholder="Major"
                name="major"
                onChange={handleTextChange}
                value={info.major || ''}
              />
            </div>
          </div>
        )}

        {type === Types.LECTURER && (
          <div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
                onChange={handleTextChange}
                value={info.name || ''}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                id="lecturer-email-input"
                type="text"
                className="form-control"
                placeholder="Email"
                name="email"
                onChange={handleTextChange}
                value={info.email || ''}
              />
            </div>
            <div className="form-group">
              <label>School</label>
              <input
                type="text"
                className="form-control"
                placeholder="School"
                name="school"
                onChange={handleTextChange}
                value={info.school || ''}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                className="form-control"
                placeholder="Department"
                name="department"
                onChange={handleTextChange}
                value={info.department || ''}
              />
            </div>
          </div>
        )}

        <button onClick={handleOnClick} className="btn btn-primary">
          Submit
        </button>
      </div>
    </View>
  );
};

const View = styled.div`
  > {
    .switch-buttons {
      margin-bottom: 2em;

      .student-btn {
        margin-right: 1em;
      }
    }
  }

  #lecturer-email-input {
    position: relative;

    &:before {
      content: 'hehehe';
      width: 100px;
      height: 100px;
      position: absolute;
      background: black;
      top: 2em;
      left: 5em;
      z-index: 5;
    }
  }
`;

export default Register;
