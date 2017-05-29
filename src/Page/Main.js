import React, { Component } from 'react';
import {
    Route,
    Link,
    Redirect,
} from 'react-router-dom'

import {
    Container,
    Collapse,
    Navbar,
    NavbarToggler,
    Nav, NavItem,
    Alert,
    Form,
    Button,
} from 'reactstrap';

import Settings from './Settings';
import Apps from './App/index';
import Domain from './Domain/Domain';
import NewApp from './App/NewApp';
import AppDetail from './App/Detail';

const routes = [
    {
        path: '/apps',
        exact: true,
        component: Apps,
        label: 'Sites',
        nav: true,
    },
    {
        path: '/app/:id',
        component: AppDetail,
    },
    {
        path: '/domains',
        component: Domain,
        label: 'Domains',
        nav: true,
    },
    {
        path: '/profile',
        component: Settings,
        label: 'Profile',
        nav: true,
    },
]

class Main extends Component {
    state = {
        openNav: false,
        messages: [],
    };

    alert = (message, color, append = false) => {
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }

        this.alertTimeout = setTimeout(() => this.setState({ messages: [] }), 5000);

        this.setState({
            messages: append ? [...this.state.messages, {message, color}] : [{message, color}]
        });
    }

    render() {
        const globalProps = {
            ...this.props,
            alert: this.alert,
        };
        return (
            <div>
                <Navbar color="faded" light toggleable>
                    <Container>
                        <NavbarToggler right onClick={() => {
                            this.setState({
                                openNav: !this.state.openNav
                            });
                        }}/>
                        <Link className="navbar-brand" to="/">Khoaapp</Link>

                        <Collapse isOpen={this.state.openNav} navbar>
                            <Nav navbar>
                                {routes.filter(r => r.nav).map((route, index) => (
                                    <NavItem key={index}>
                                        <Link className="nav-link" to={route.path}>{route.label}</Link>
                                    </NavItem>
                                ))}
                            </Nav>

                            <Form inline className="ml-auto hidden-sm-down">
                                <Button onClick={() => this.props.history.push('/apps/new')} color="success">New Site</Button>
                            </Form>
                        </Collapse>
                    </Container>
                </Navbar>

                <Container>
                    <Button className="mt-2 hidden-sm-up" block onClick={() => this.props.history.push('/apps/new')} color="success">New Site</Button>

                    <div className="py-3">

                        {this.state.messages.map(({message, color}, index) => (
                            <Alert key={index} color={color}>{message}</Alert>
                        ))}

                        <Route
                            path="/"
                            exact={true}
                            render={props => <Redirect to="/apps"/>}
                        />

                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                render={props => React.createElement(route.component, { ...globalProps, ...props })}
                            />
                        ))}

                        <Route
                            path="/apps/new"
                            render={props => (
                                <NewApp {...globalProps} {...props} />
                            )}
                        />
                    </div>
                </Container>
            </div>
        );
    }
}

export default Main;
