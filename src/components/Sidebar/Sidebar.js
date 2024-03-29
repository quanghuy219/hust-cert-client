import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link as LinkView } from 'react-router-dom';
import styled from 'styled-components';

import LinksGroup from './LinksGroup/LinksGroup';

import s from './Sidebar.module.scss';
import { Role } from '../../constants';
import { HustIcon } from './HustIcon';

const Link = styled(LinkView)`
  width: 100%;
  height: 100%;
`;
class Sidebar extends React.Component {
  renderSidebarItemByRole() {
    const adminItems = (
      <div>
        <LinksGroup header="Dashboard" headerLink="/home" />
        <LinksGroup header="Training Programs" headerLink="/home/programs" />
        <LinksGroup header="Register" headerLink="/home/register" />
        <LinksGroup header="Courses" headerLink="/home/courses" />
      </div>
    );

    const lecturerItems = (
      <div>
        <LinksGroup header="Classes" headerLink="/home" />
      </div>
    );

    const studentItems = (
      <div>
        <LinksGroup header="Transcript" headerLink="/home" />
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
            <HustIcon />
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
