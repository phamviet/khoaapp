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
import NewApp from './App/NewApp';

const routes = [
    {
        path: '/apps',
        exact: true,
        component: Apps,
        label: 'Apps',
    },
    {
        path: '/profile',
        component: Settings,
        label: 'Profile',
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
            <Container>
                <Navbar color="faded" light toggleable>
                    <NavbarToggler right onClick={() => {
                        this.setState({
                            openNav: !this.state.openNav
                        });
                    }}/>

                    <Link className="navbar-brand" to="/">Khoaapp</Link>
                    <Collapse isOpen={this.state.openNav} navbar>
                        <Nav navbar>
                            {routes.map((route, index) => (
                                <NavItem key={index}>
                                    <Link className="nav-link" to={route.path}>{route.label}</Link>
                                </NavItem>
                            ))}
                        </Nav>

                        <Form inline className="ml-auto">
                            <Button onClick={() => this.props.history.push('/apps/new')} color="success">Create Site</Button>
                        </Form>
                    </Collapse>
                </Navbar>

                <div className="pt-3">
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
        );
    }
}

export default Main;
