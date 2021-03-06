import React, { Component } from 'react';
import {
    Route,
    Redirect,
} from 'react-router-dom'

import {
    Container,
    Alert,
    Button,
} from 'reactstrap';

import Navbar from '../Component/Navbar';
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
        const { history } = this.props;

        const globalProps = {
            ...this.props,
            alert: this.alert,
        };
        return (
            <div>
                <Navbar
                    routes={routes}
                    onBrandClick={() => history.push('/')}
                    onNavClick={path => history.push(path)}
                    onButtonClick={() => history.push('/apps/new')}
                />

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
