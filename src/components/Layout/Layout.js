/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { connect } from 'react-redux';

import s from './Layout.module.scss';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';

// Dashboard component is loaded directly as an example of server side rendering
import Dashboard from '../../pages/dashboard';
import NotFound from '../../pages/notFound';
import Enrollment from '../../pages/enrollment';
import Transript from '../../pages/transcript';
import Verification from '../../pages/verification';
import VerificationHistory from '../../pages/verificationHistory';
import { Role } from '../../constants';
import { logoutUser } from '../../actions/user';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: false,
    };
  }

  renderRouter() {
    const adminRoute = (
      <Switch>
        <Route path="/home" exact component={Dashboard} />
        <Route path="/home/classes/:classID" exact component={Enrollment} />
        <Redirect to="/" />
      </Switch>
    );
    const lecturerRoute = (
      <Switch>
        <Route path="/home" exact component={Dashboard} />
        <Route path="/home/classes/:classID" exact component={Enrollment} />
        <Redirect to="/" />
      </Switch>
    );
    const studentRoute = (
      <Switch>
        <Route path="/home" exact component={Transript} />
        <Route path="/home/transcript" exact component={Transript} />
        <Route path="/home/history" exact component={VerificationHistory} />
        <Redirect to="/" />
      </Switch>
    );

    const verifierRoute = (
      <Switch>
        <Route path="/verification/:shareCode" exact component={Verification} />
        <Route component={NotFound} />
      </Switch>
    );
    if (Role.getAdminRoles().includes(this.props.role)) {
      return adminRoute;
    } else if (this.props.role === Role.LECTURER) {
      return lecturerRoute;
    } else if (this.props.role === Role.STUDENT) {
      return studentRoute;
    } else if (this.props.verifier) {
      return verifierRoute;
    }
  }

  render() {
    return (
      <div className={s.root}>
        <Sidebar />
        <div className={cx(s.wrap, { [s.sidebarOpen]: this.state.sidebarOpen })}>
          <Header
            sidebarToggle={() =>
              this.setState({
                sidebarOpen: !this.state.sidebarOpen,
              })
            }
            showDropdown={Role.requiredLoginRoles().includes(this.props.role) ? true : false}
          />
          <main className={s.content}>{this.renderRouter()}</main>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.auth.role,
  };
};

const mapDispatchToProps = {
  logout: logoutUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
