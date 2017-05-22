import React, { Component } from 'react';
import {
    Route,
    Link
} from 'react-router-dom'

import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap';

import Profile from './Settings/Profile';
import Security from './Settings/Security';


const routes = [
    {
        path: '',
        exact: true,
        component: Profile,
        label: 'Profile',
    },
    {
        path: '/security',
        component: Security,
        label: 'Security',
    },
]

class Settings extends Component {
    render() {
        const { match, logout } = this.props;

        return (
            <Row>
                <Col xs="12" sm="3" className="mb-3">
                    <Nav vertical>
                        {routes.map((route, index) => (
                            <NavItem key={index}>
                                <Link className="nav-link" to={match.url + route.path}>{route.label}</Link>
                            </NavItem>
                        ))}
                        <NavItem>
                            <NavLink onClick={logout} href="#">Logout</NavLink>
                        </NavItem>
                    </Nav>
                </Col>
                <Col xs="12" sm="9">
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={match.url + route.path}
                            exact={route.exact}
                            render={props => React.createElement(route.component, { ...this.props, ...props })}
                        />
                    ))}
                </Col>
            </Row>
        );
    }
}

export default Settings;
