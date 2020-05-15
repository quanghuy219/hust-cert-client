import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ErrorPage from '../pages/error';

import '../styles/theme.scss';
import '../styles/style.css';
import LayoutComponent from '../components/Layout';
//import DocumentationLayoutComponent from '../documentation/DocumentationLayout';
import Login from '../pages/login';
import Register from '../pages/register';
import { logoutUser } from '../actions/user';
import { Role, ACTOR } from '../constants'

const PrivateRoute = ({dispatch, component, isAuthenticated, role, ...rest }) => {
    if (!isAuthenticated || !Role.getAll().includes(role)) {
        dispatch(logoutUser());
        return (<Redirect to="/login"/>)
		} else {
        return ( // eslint-disable-line
            <Route {...rest} render={props => (React.createElement(component, props))}/>
        );
    }
};

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

class App extends React.PureComponent {

	userActor() {
		if ( Role.getAdminRoles().includes(this.props.role) ) {
      return ACTOR.ADMIN;
    }
    else if (this.props.role === Role.LECTURER) {
      return ACTOR.LECTURER;
    }
    else {
      return ACTOR.STUDENT
    }
	}

  render() {
		const actor = this.userActor();
		const redirectedRoute = `/home/${actor}`;

    return (
        <div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />

            <HashRouter>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to={redirectedRoute} />}/>
                    <Route path="/home" exact render={() => <Redirect to={redirectedRoute} />}/>
                    <PrivateRoute path="/home" dispatch={this.props.dispatch} component={LayoutComponent} isAuthenticated={this.props.isAuthenticated} role={this.props.role} />
                    <Route path="/documentation" exact
                           render={() => <Redirect to="/documentation/getting-started/overview"/>}/>
                    {/* <Route path="/documentation" component={DocumentationLayoutComponent}/> */}
                    <Route path="/register" exact component={Register}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/error" exact component={ErrorPage}/>
                </Switch>
            </HashRouter>
        </div>

    );
  }
}

const mapStateToProps = state => ({
  role: state.auth.role,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
