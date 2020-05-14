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
import { Switch, Route, withRouter } from 'react-router';
import { connect } from 'react-redux';

import s from './Layout.module.scss';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';

// Dashboard component is loaded directly as an example of server side rendering
import Dashboard from '../../pages/dashboard'
import Buttons from '../../pages/buttons'
import Charts from '../../pages/charts'
import Maps from '../../pages/google'
import NotFound from '../../pages/notFound'
import Icons from '../../pages/icons'
import Typography from '../../pages/typography'
import Tables from '../../pages/tables'
import Notifications from '../../pages/notifications'
import Posts from '../../pages/posts'
import Profile from '../../pages/profile'
import Privacy from '../../pages/privacy'

import { Role } from '../../constants';
import { loginAction } from '../../actions/user';

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
        <Route path="/home/admin" exact component={Dashboard} />
        <Route path="/home/admin/typography" exact component={Typography} />
        <Route path="/home/admin/tables" exact component={Tables} />
        <Route path="/home/admin/posts" component={Posts} />
        <Route path="/home/admin/privacy" exact component={Privacy} />
        <Route path="/home/admin/profile" exact component={Profile} />
        <Route path="/home/admin/notifications" exact component={Notifications} /> 
        <Route path="/home/admin/components/buttons" exact component={Buttons} />
        <Route path="/home/admin/components/charts" exact component={Charts} />
        <Route path="/home/admin/components/icons" exact component={Icons} />
        <Route path="/home/admin/components/maps" exact component={Maps} />
        <Route component={NotFound}/>
      </Switch>
    );
    const lecturerRoute = (
      <Switch>
        <Route path="/home/lecturer" exact component={Dashboard} />
        <Route path="/home/lecturer/typography" exact component={Typography} />
        <Route path="/home//lecturer/tables" exact component={Tables} />
        <Route component={NotFound}/>
      </Switch>
    )
    const studentRoute = (
      <Switch>
        <Route path="/home/student" exact component={Dashboard} />
        <Route path="/home/student/typography" exact component={Typography} />
        <Route path="/home/student/tables" exact component={Tables} />
        <Route component={NotFound}/>
      </Switch>
    )

    if ( Role.getAdminRoles().includes(this.props.role) ) {
      return adminRoute;
    }
    else if (this.props.role === Role.LECTURER) {
      return lecturerRoute
    }
    else {
      return studentRoute
    }
  }

  render() {
    return (
      <div className={s.root}>
        <Sidebar />
        <div
          className={cx(s.wrap, {[s.sidebarOpen]: this.state.sidebarOpen})}
        >
          <Header
            sidebarToggle={() =>
              this.setState({
                sidebarOpen: !this.state.sidebarOpen,
              })
            }
          />
          <main className={s.content}>
            {this.renderRouter()}
          </main>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.auth.role
  };
}

const mapDispatchToProps = {
  logout: loginAction.logoutUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Layout));
