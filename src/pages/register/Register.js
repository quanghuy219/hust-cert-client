import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useState } from 'react';
import { accountAction } from '../../actions/account';
import config from '../../core/configs';
import styled from 'styled-components';
import { Role } from '../../constants/';
import { useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';
import './style.css';

const BASE_EMAIL = `@${config.BASE_DOMAIN}`;
const regex = new RegExp(`^[a-zA-Z0-9.-_]*@${config.BASE_DOMAIN}$`);

const isValidEmail = (email) => {
  return regex.test(email);
};

const renderModalContent = (data) => {
  let content = '';
  for (let key in data) {
    let value = data[key];
    content += `
      <div>
        <span>${key}</span><span>${value}</span>
      </div>
    `;
  }

  return content;
};

const defaultInfo = {
  name: '',
  major: '',
  email: BASE_EMAIL,
  school: '',
  department: '',
  super_admin: false,
};

const Register = () => {
  const [type, setType] = useState(Role.STUDENT);

  const [info, setInfo] = useState({ ...defaultInfo });

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [modalContent, setModalContent] = useState('');

  const role = useSelector((state) => state.auth.role);

  const updateStudentInfo = ({ name, major }) => {
    let newInfo = { ...info };

    if (typeof name !== 'undefined') {
      newInfo.name = name;
    }

    if (typeof major !== 'undefined') {
      newInfo.major = major;
    }

    setInfo(newInfo);
  };

  const updateLecturerInfo = ({ name, email, school, department }) => {
    let newInfo = { ...info };

    if (typeof name !== 'undefined') {
      newInfo.name = name;
    }

    if (typeof email !== 'undefined') {
      newInfo.email = email;
    }

    if (typeof school !== 'undefined') {
      newInfo.school = school;
    }

    if (typeof department !== 'undefined') {
      newInfo.department = department;
    }

    setInfo(newInfo);
  };

  const updateAdminInfo = ({ name, email }) => {
    let newInfo = { ...info };
    newInfo.super_admin = false;

    if (typeof name !== 'undefined') {
      newInfo.name = name;
    }

    if (typeof email !== 'undefined') {
      newInfo.email = email;
    }

    setInfo(newInfo);
  };

  const updateSuperAdminInfo = ({ name, email }) => {
    let newInfo = { ...info };
    newInfo.super_admin = true;

    if (typeof name !== 'undefined') {
      newInfo.name = name;
    }

    if (typeof email !== 'undefined') {
      newInfo.email = email;
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

    if (type === Role.STUDENT) {
      updateStudentInfo(newInfo);
    } else if (type === Role.LECTURER) {
      updateLecturerInfo(newInfo);
    } else if (type === Role.ADMIN) {
      updateAdminInfo(newInfo);
    } else if (type === Role.SUPER_ADMIN) {
      updateSuperAdminInfo(newInfo);
    }
  };

  const handleOnClick = (event) => {
    let nextAction = null;

    if (type === Role.STUDENT) {
      nextAction = accountAction.registerStudentAccount(info);
    } else if (type === Role.LECTURER) {
      nextAction = accountAction.registerLecturerAccount(info);
    } else if (type === Role.ADMIN || type === Role.SUPER_ADMIN) {
      nextAction = accountAction.registerAdminAccount(info);
    }

    nextAction.then((data) => {
      setModalContent(renderModalContent(data));
      toggleModal();
    });

    setInfo({ ...defaultInfo });

    event.preventDefault();
    return false;
  };

  const switchToStudent = () => {
    setType(Role.STUDENT);
    setInfo({ ...defaultInfo });
  };

  const switchToLecturer = () => {
    setType(Role.LECTURER);
    setInfo({ ...defaultInfo });
  };

  const switchToAdmin = () => {
    setType(Role.ADMIN);
    setInfo({ ...defaultInfo, super_admin: false });
  };

  const switchToSuperAdmin = () => {
    setType(Role.SUPER_ADMIN);
    setInfo({ ...defaultInfo, super_admin: true });
  };

  const SwitchButtons = (
    <>
      <button
        className={`student-btn btn ${type === Role.STUDENT ? 'btn-info' : 'btn-outline-info'}`}
        onClick={switchToStudent}
      >
        Student
      </button>
      <button
        className={`lecturer-btn btn ${type === Role.LECTURER ? 'btn-info' : 'btn-outline-info'}`}
        onClick={switchToLecturer}
      >
        Lecturer
      </button>
      {(role === Role.ADMIN || role === Role.SUPER_ADMIN) && (
        <button
          className={`admin-btn btn ${type === Role.ADMIN ? 'btn-info' : 'btn-outline-info'}`}
          onClick={switchToAdmin}
        >
          Admin
        </button>
      )}
      {role === Role.SUPER_ADMIN && (
        <button
          className={`super-admin-btn btn ${
            type === Role.SUPER_ADMIN ? 'btn-info' : 'btn-outline-info'
          }`}
          onClick={switchToSuperAdmin}
        >
          Super Admin
        </button>
      )}
    </>
  );

  const StudentForm = (
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
          required
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
          required
        />
      </div>
    </div>
  );

  const LecturerForm = (
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
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          name="email"
          onChange={handleTextChange}
          value={info.email || ''}
          pattern={`^[a-zA-Z0-9.-_]+@${config.BASE_DOMAIN}$`}
          required
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
          required
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
          required
        />
      </div>
    </div>
  );

  const AdminForm = (
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
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          name="email"
          onChange={handleTextChange}
          value={info.email || ''}
          required
        />
      </div>
    </div>
  );

  return (
    <View>
      <Breadcrumb>
        <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
        <BreadcrumbItem active>Register</BreadcrumbItem>
      </Breadcrumb>
      <h1 className="page-title mb-lg">Register</h1>
      <div className="switch-buttons">{SwitchButtons}</div>
      <form onSubmit={handleOnClick}>
        {type === Role.STUDENT && StudentForm}

        {type === Role.LECTURER && LecturerForm}

        {type === Role.ADMIN && AdminForm}

        {type === Role.SUPER_ADMIN && AdminForm}

        <input value={'Submit'} type={'submit'} className="btn btn-primary" />
      </form>

      <div>
        <Modal
          className={'register-success-modal'}
          isOpen={modal}
          toggle={toggleModal}
          backdrop={true}
          keyboard={true}
        >
          <ModalHeader toggle={toggleModal}>Register successfully</ModalHeader>
          <ModalBody>
            <div dangerouslySetInnerHTML={{ __html: modalContent }}></div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleModal}>
              OK
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </View>
  );
};

// FIXME: Responsive layout
const View = styled.div`
  > {
    .switch-buttons {
      margin-bottom: 2em;

      > button ~ button {
        margin-left: 1em;
      }
    }
  }

  form {
    input[type='text'],
    input[type='email'] {
      width: 25.5em;
    }
  }
`;

export default Register;
