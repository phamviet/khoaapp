import React, { Component } from 'react';
import {
    Route,
    Link
} from 'react-router-dom'

import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap';

import Profile from './Settings/Profile';


const routes = [
    {
        path: '',
        exact: true,
        component: Profile,
        label: 'Profile',
    },
]

class Settings extends Component {
    render() {
        const { match, logout } = this.props;

        return (
            <Row>
                <Col xs="4" sm="3">
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
                <Col xs="8" sm="9">
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
