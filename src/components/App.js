import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';

import '../styles/theme.scss';
import '../styles/style.css';
import LayoutComponent from '../components/Layout';
import Login from '../pages/login';
import Register from '../pages/register';
import ErrorPage from '../pages/error';
import { logoutUser } from '../actions/user';
import { Role } from '../constants';

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

const CloseButton = ({ closeToast }) => (
  <i onClick={closeToast} className="la la-close notifications-close" />
);

class App extends React.PureComponent {
  render() {
    return (
        <div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
                transition={Slide}
            />
              <BrowserRouter>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to='/home' />}/>
                    {/* <Route path="/home" exact render={() => <Redirect to={redirectedRoute} />}/>  */}
                    <PrivateRoute path="/home" dispatch={this.props.dispatch} component={LayoutComponent} isAuthenticated={this.props.isAuthenticated} role={this.props.role} />
    
                    <Route path="/register" exact component={Register}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/error" exact component={ErrorPage}/>
                    <Route path="/verification/:shareCode" exact render={(props) => <LayoutComponent {...props} verifier={true} />} />
                </Switch>
              </BrowserRouter>
        </div>

    );
  }
}

const mapStateToProps = (state) => ({
  role: state.auth.role,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
