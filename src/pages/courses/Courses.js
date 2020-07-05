import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Table, Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { generalUtils } from '../../core/utils/general';
import { coursesAction } from '../../actions/courses';
import { schoolsApi } from '../../core/api/schools';
import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const defaultCourse = {
  name: '',
  credits: 0,
  school_id: -1,
};

const CoursesView = ({ className }) => {
  const [page, setPage] = useState(1);
  const { data, totalItems, itemsPerPage } = useSelector((state) => state.courses);

  const [newCourse, setNewCourse] = useState({ ...defaultCourse });

  const [schools, setSchools] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    coursesAction.fetchAllCourses({ page })(dispatch);
  }, [dispatch, page]);

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (currentPage) => {
    let selected = currentPage.selected + 1;

    setPage(selected);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    schoolsApi.getSchools().then(
      (res) => {
        setSchools(res);
      },
      (error) => {
        generalUtils.showErrorNotification(error.message);
      },
    );
  }, [isModalOpen]);

  const toggleIsModalOpen = () => setIsModalOpen(!isModalOpen);

  const handleButtonClick = () => {
    toggleIsModalOpen();
  };

  const handleNewCourseFormInputChange = (event) => {
    const course = {};
    course[event.target.name] = event.target.value;

    if (course.credits) {
      course.credits = parseInt(course.credits, 10);
    }

    setNewCourse((c) => ({ ...c, ...course }));
  };

  const handleSelectSchool = (event) => {
    const school_id = parseInt(event.target.value) || '';
    setNewCourse((c) => ({ ...c, school_id }));
  };

  const handleSubmitNewCourseForm = (event) => {
    event.preventDefault();
    coursesAction.createNewCourse(newCourse).then((_) => {
      toggleIsModalOpen();
      setNewCourse({ ...defaultCourse });
      coursesAction.fetchAllCourses({ page })(dispatch);
    });
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem active>Courses</BreadcrumbItem>
      </Breadcrumb>
      <button className={'student-btn btn btn-info'} onClick={handleButtonClick} style={{marginBottom: "20px"}}>
        Create a new course
      </button>
      <Table className={'table'}>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Name</th>
            <th>Credits</th>
            <th>School</th>
          </tr>
        </thead>
        <tbody>
          {data.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.credits}</td>
              <td>{course.school.name}</td>
            </tr>
          ))}
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
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      <Modal
        className={'create-new-course-modal'}
        isOpen={isModalOpen}
        toggle={toggleIsModalOpen}
        backdrop={true}
        keyboard={true}
      >
        <ModalHeader toggle={toggleIsModalOpen}>Create a new course</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitNewCourseForm}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
                onChange={handleNewCourseFormInputChange}
                value={newCourse.name || ''}
                required
              />
            </div>
            <div className="form-group">
              <label>Credits</label>
              <input
                type="number"
                className="form-control"
                placeholder="Credits"
                name="credits"
                onChange={handleNewCourseFormInputChange}
                value={newCourse.credits || ''}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>School</label>
              <select
                value={newCourse.school_id}
                onChange={handleSelectSchool}
                className={'custom-select'}
                required
              >
                <option value="">Choose...</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <input value={'Submit'} type={'submit'} className="btn btn-primary" />
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

const Courses = styled(CoursesView)``;

export default Courses;
