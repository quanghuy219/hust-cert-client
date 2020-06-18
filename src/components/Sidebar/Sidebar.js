import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import Icon from '../Icon';
import LinksGroup from './LinksGroup/LinksGroup';

import s from './Sidebar.module.scss';
import { Role } from '../../constants';

class Sidebar extends React.Component {
  renderSidebarItemByRole() {
    const adminItems = (
      <div>
        <LinksGroup header="Dashboard" headerLink="/home" />
        <LinksGroup header="Training Programs" headerLink="/home/programs" />
        <LinksGroup header="Notifications" headerLink="/home/admin/notifications" />
        <LinksGroup header="Register" headerLink="/home/register" />
        <LinksGroup header="Courses" headerLink="/home/courses" />
      </div>
    );

    const lecturerItems = (
      <div>
        <LinksGroup header="Dashboard" headerLink="/home" glyph="dashboard" />
        <LinksGroup header="Tables Basic" headerLink="/home/lecturer/tables" glyph="tables" />
        <LinksGroup
          header="Notifications"
          headerLink="/home/lecturer/notifications"
          glyph="notifications"
        />
      </div>
    );

    const studentItems = (
      <div>
        <LinksGroup header="Dashboard" headerLink="/home" />
        <LinksGroup header="History" headerLink="/home/history" />
      </div>
    );

    const verifierItems = (
      <div>
        <LinksGroup header="Dashboard" headerLink="#" />
      </div>
    );

    if (Role.getAdminRoles().includes(this.props.role)) {
      return adminItems;
    } else if (this.props.role === Role.LECTURER) {
      return lecturerItems;
    } else if (this.props.role === Role.STUDENT) {
      return studentItems;
    } else if (this.props.role === Role.VERIFIER) {
      return verifierItems;
    }
  }

  render() {
    return (
      <nav className={s.root}>
        <header className={s.logo}>
          <Link to="/home">
            <Icon glyph="logo" />
          </Link>
        </header>
        <ul className={s.nav}>{this.renderSidebarItemByRole()}</ul>
      </nav>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    role: store.auth.role,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
