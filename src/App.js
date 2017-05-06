import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Route,
    Link,
    withRouter
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
import './App.css';

import api from './api';

import Login from './Page/Login';
import Apps from './Page/App/index';
import NewApp from './Page/App/NewApp';
import Settings from './Page/Settings';

const routes = [
    {
        path: '/',
        exact: true,
        component: Apps,
        label: 'Sites',
    },
    {
        path: '/profile',
        label: 'Profile',
        component: Settings,
    },
]

class App extends Component {
    state = {
        initializing: true,
        ready: false,
        profile: undefined,
        apps: [],
        messages: [],
    };

    static propTypes = {
        config: PropTypes.object.isRequired
    }

    constructor() {
        super();

        api.addAfterWare(response => {
            if ( response.status > 500 ) {
                console.error(response);
            } else if ( response.status === 401 ) {
                this.resetSession();
            }
        });
    }

    componentWillMount() {
        this.start();
    }

    async start() {
        let state = {};

        const response = await api.profile();

        if ( response.ok ) {
            const { apps, ...data } = await response.json();

            state.ready = true;
            state.profile = data;
            state.apps = apps || [];
        }

        state.initializing = false;
        this.setState(state);
    }

    logout = async () => {
        const logout = await api.logout();
        if ( logout.ok ) {
            this.resetSession();
        }
    }

    resetSession = () => {
        this.setState({ ready: false });
        this.props.history.push('/');
    }

    onLoggedIn = () => {
        this.start();
    };

    updateProfile = profile => {
        this.setState({ profile: { ...this.state.profile, ...profile } });
    };

    addApp = app => {
        this.setState({ apps: [...this.state.apps, app] });
    };

    removeApp = app => {
        this.setState({ apps: this.state.apps.filter(a => a.id !== app.id) });
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

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
        const { initializing, ready, profile, apps, messages } = this.state;
        if ( initializing ) {
            return null;
        }

        if ( !ready ) {
            return <Login onSuccess={this.onLoggedIn}/>;
        }

        const globalProps = {
            config: this.props.config,
            profile,
            apps,
            updateProfile: this.updateProfile,
            addApp: this.addApp,
            removeApp: this.removeApp,
            logout: this.logout,
            alert: this.alert,
        };

        return (
            <Container>
                <Navbar color="faded" light toggleable>
                    <NavbarToggler right onClick={this.toggle}/>
                    <Link className="navbar-brand" to="/">Khoaapp</Link>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            {routes.map((route, index) => (
                                <NavItem key={index}>
                                    <Link className="nav-link" to={route.path}>{route.label}</Link>
                                </NavItem>
                            ))}
                        </Nav>

                        <Form inline className="ml-auto">
                            <Button onClick={() => this.props.history.push('/create')} color="success">Create Site</Button>
                        </Form>
                    </Collapse>
                </Navbar>

                <div className="pt-3">
                    {messages.map(({message, color}, index) => (
                        <Alert key={index} color={color}>{message}</Alert>
                    ))}

                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            render={props => React.createElement(route.component, { ...props, ...globalProps })}
                        />
                    ))}

                    <Route
                        path="/create"
                        render={props => (
                            <NewApp {...props} {...globalProps} />
                        )}
                    />
                </div>
            </Container>
        );
    }
}

export default withRouter(App);
