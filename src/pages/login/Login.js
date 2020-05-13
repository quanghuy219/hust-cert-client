import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Nav, NavItem, NavLink,
  Button,
  FormGroup,
  Input,
  Row,
  Col,
  Form,
  Label,
} from 'reactstrap';
import { loginAction } from '../../actions/user';
import { ACTOR } from '../../constants';
import './style.css';

class Login extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    isFetching: PropTypes.bool,
    location: PropTypes.any, // eslint-disable-line
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    isAuthenticated: false,
    isFetching: false,
    location: {},
    errorMessage: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      role: 'admin',
      errorMessage: props.errorMessage
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log()
    if (nextProps.errorMessage) {
      this.setState({errorMessage: nextProps.errorMessage})
    }
  }

  changeLogin = (event) => {
    this.setState({ login: event.target.value });
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  doLogin = (e) => {
    const { login, password } = this.state;
    if (this.state.role === ACTOR.STUDENT) {
      this.props.studentLogin(login, password);
    }
    else {
      if (!this.emailIsValid(login)) {
        this.setState({errorMessage: 'Invalid email address'})
        return
      }
      this.props.login(login, password, this.state.role);
    }
    e.preventDefault();
  }

  emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  changeLoginActor = (loginRole) => {
    this.setState({role: loginRole });
  }

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: '/app' },
    };

    if (this.props.isAuthenticated) {
      // cant access login page while logged in
      return <Redirect to={from} />;
    }

    return (
      <div className="login-block">
        <div className="container">
          <Row>
            <Col className="col-md-4 login-sec">
              <h2 className="text-center">Login Now</h2>

              <Nav className="nav-pills nav-fill nav-header">
                <NavItem>
                  <NavLink className={this.state.role === 'admin' ? "active" : ""} onClick={() => this.changeLoginActor('admin')}>Admin</NavLink>
                </NavItem>

                <NavItem>
                  <NavLink className={this.state.role === 'lecturer' ? "active" : ""} onClick={() => this.changeLoginActor('lecturer')} >Lecturer</NavLink>
                </NavItem>

                <NavItem>
                  <NavLink className={this.state.role === 'student' ? "active" : ""} onClick={() => this.changeLoginActor('student')} >Student</NavLink>
                </NavItem>
              </Nav>

              <p className={this.state.errorMessage ? "alert alert-danger" : "" } > {this.state.errorMessage} </p>
              <Form className="login-form" onSubmit={this.doLogin}>
                <FormGroup>
                  <Label for="exampleInputEmail1" className="text-uppercase">Account</Label>
                  <Input type="text" className="form-control" placeholder="" value={this.state.login} onChange={this.changeLogin} required/>
                </FormGroup>

                <FormGroup>
                  <Label for="exampleInputPassword1" className="text-uppercase">Password</Label>
                  <Input type="password" className="form-control" placeholder="" value={this.state.password} onChange={this.changePassword} required/>
                </FormGroup>

                <Button type="submit" className="btn btn-login float-right">Submit</Button>
              </Form>
            </Col>

            <Col className="col-md-8 banner-sec">
              <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                </ol>
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active">
                    <img className="d-block img-fluid" src="https://static.pexels.com/photos/33972/pexels-photo.jpg" alt="First slide" />
                  </div>
                </div>
              </div>
            </Col>

          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

const mapDispatchToProps = {
  login: loginAction.login,
  studentLogin: loginAction.studentLogin
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
