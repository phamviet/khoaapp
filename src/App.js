import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Route,
    withRouter,
    Redirect,
} from 'react-router-dom'


import api from './api';

import Login from './Page/Login';
import Main from './Page/Main';

const routes = [
    {
        path: '/',
        component: ({ready, ...props}) => {
            if (!ready) {
                return <Redirect to='/login' />
            }

            return <Main {...props}/>
        },
    },
    {
        path: '/login',
        component: Login,
    },
];

class App extends Component {
    state = {
        initializing: true,
        ready: false,
        profile: undefined,
        apps: [],
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
        this.startApp();
    }

    startApp = async () => {
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
        this.setState({ ready: false }, () => {
            this.props.history.push('/login');
        });
    }

    updateProfile = profile => {
        this.setState({ profile: { ...this.state.profile, ...profile } });
    };

    addApp = app => {
        this.setState({ apps: [...this.state.apps, app] });
    };

    removeApp = app => {
        this.setState({ apps: this.state.apps.filter(a => a.id !== app.id) });
    };

    render() {
        const { initializing, ready, profile, apps } = this.state;
        if ( initializing ) {
            return null;
        }

        const globalProps = {
            config: this.props.config,
            ready,
            startApp: this.startApp,
            profile,
            apps,
            updateProfile: this.updateProfile,
            addApp: this.addApp,
            removeApp: this.removeApp,
            logout: this.logout,
        };

        return (
            <div style={{height: '100%'}}>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        render={props => React.createElement(route.component, {...globalProps, ...props })}
                    />
                ))}
            </div>
        );
    }
}

export default withRouter(App);
