import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/core';
import LayoutComponent from '../components/Layout';
import Register from '../pages/register';
import Courses from '../pages/courses';
import Login from '../pages/login';
import Programs from '../pages/programs';
import { logoutUser } from '../actions/user';
import { Role } from '../constants';
import 'react-toastify/dist/ReactToastify.min.css';
import '../styles/theme.scss';
import '../styles/style.css';

const override = css`
  top: 80px;
  positiion: relative;
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const PrivateRoute = ({ dispatch, component, isAuthenticated, role, ...rest }) => {
  if (!isAuthenticated || !Role.getAll().includes(role)) {
    dispatch(logoutUser());
    return <Redirect to="/login" />;
  } else {
    return (
      // eslint-disable-line
      <Route {...rest} render={(props) => React.createElement(component, props)} />
    );
  }
};

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact render={() => <Redirect to="/home" />} />
            {/* <Route path="/home" exact render={() => <Redirect to={redirectedRoute} />}/>  */}
            <PrivateRoute
              path="/home"
              dispatch={this.props.dispatch}
              component={LayoutComponent}
              isAuthenticated={this.props.isAuthenticated}
              role={this.props.role}
            />
            <Route path="/login" exact component={Login} />
            <Route
              path="/verification/:shareCode"
              exact
              render={(props) => <LayoutComponent {...props} verifier={true} />}
            />
          </Switch>
        </BrowserRouter>

        <div className="sweet-loading" style={{ position: 'relative', top: '80px' }}>
          <ClipLoader
            css={override}
            size={50}
            color={'#123abc'}
            loading={this.props.loader.loading}
          />
        </div>

        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          transition={Slide}
          hideProgressBar
          closeOnClick
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  role: state.auth.role,
  isAuthenticated: state.auth.isAuthenticated,
  loader: state.loader,
});

export default connect(mapStateToProps)(App);
