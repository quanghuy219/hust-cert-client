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
        <LinksGroup header="Dashboard" headerLink="/home" glyph="dashboard" />
        <LinksGroup header="Typography" headerLink="/home/admin/typography" glyph="typography" />
        <LinksGroup header="Tables Basic" headerLink="/home/admin/tables" glyph="tables" />
        <LinksGroup
          header="Notifications"
          headerLink="/home/admin/notifications"
          glyph="notifications"
        />
        <LinksGroup
          header="Components"
          headerLink="/home/admin/components"
          childrenLinks={[
            {
              name: 'Buttons',
              link: '/home/admin/components/buttons',
            },
            {
              name: 'Charts',
              link: '/home/admin/components/charts',
            },
            {
              name: 'Icons',
              link: '/home/admin/components/icons',
            },
            {
              name: 'Maps',
              link: '/home/admin/components/maps',
            },
          ]}
          glyph="components"
        />
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
        <LinksGroup header="Dashboard" headerLink="/home" glyph="dashboard" />
        <LinksGroup header="Tables Basic" headerLink="/home/student/tables" glyph="tables" />
      </div>
    );

    if (Role.getAdminRoles().includes(this.props.role)) {
      return adminItems;
    } else if (this.props.role === Role.LECTURER) {
      return lecturerItems;
    } else {
      return studentItems;
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
