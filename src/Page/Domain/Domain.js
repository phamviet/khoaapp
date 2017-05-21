import React, { Component } from 'react';
import {
    Row,
    Col,
    Card, CardBlock,
    Button
} from 'reactstrap';
import humanize from 'humanize';
import { Route } from 'react-router-dom'

import api from '../../api';

import DomainForm from '../../Component/Form/Domain';

const routes = [

    {
        path: '/edit/:id',
        exact: true,
        component: DomainForm,
    },
    {
        path: '/new',
        component: DomainForm,
    },
    {
        path: '',
        exact: true,
        component: ({domains, handleDelete}) => {
            return (
                <Card>
                    <CardBlock>
                        {Array.from(domains.values()).map((domain, index) => (
                            <ListItem index={index} key={index} domain={domain} handleDelete={e => handleDelete(e, domain)} />
                        ))}
                    </CardBlock>
                </Card>
            );
        },
    },
]

const ListItem = ({ domain, handleDelete }) => {
    return (
        <div>
            <Row>
                <Col sm="8">
                    {domain.name}
                    {' '}
                    <a target="_blank" href={`http://${domain.name}`}>
                        <i className="fa fa-external-link"/>
                    </a>
                    <br/>
                    <small className="text-muted">{humanize.relativeTime(domain.created_at)}</small>
                </Col>

                <Col sm="4" className="text-right">
                    <Button onClick={handleDelete} outline color="danger">Delete</Button>
                </Col>
            </Row>
            <hr/>
        </div>
    );
}

export default class Domain extends Component {
    domains = new Map();

    componentWillMount() {
        this.load();
    }

    async load() {
        const res = await api.get( '/domain' );

        if (res.ok) {
            const domains = await res.json();
            (domains || []).map(domain => this.domains.set(domain.id, domain));
            this.forceUpdate()
        }
    };

    handleSet = (domain) => {
        this.domains.set(domain.id, domain);
        this.forceUpdate()
    };

    handleDelete = async (e, domain) => {
        e.preventDefault();

        if (!confirm('Are you sure you want to delete this domain?')) {
            return;
        }

        const del = await api.delete(`/domain/${domain.id}` );

        if ( del.ok ) {
            this.domains.delete(domain.id);
            this.forceUpdate();
            this.props.alert(`"${domain.name}" is successfully deleted`);
        }
    };

    render() {
        const { match, history } = this.props;
        return (
            <div>
                <h2 className="head">
                    Domain List
                    { history.location.pathname === '/domains'
                    && <Button
                        className="ml-3"
                               size="sm"
                               outline
                               onClick={() => this.props.history.push('/domains/new')}
                               color="success">Add Domain</Button>}
                </h2>

                <hr/>

                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={match.url + route.path}
                        exact={route.exact}
                        render={props => React.createElement(route.component, {
                            ...this.props, ...props,
                            domains: this.domains,
                            onSet: this.handleSet,
                            handleDelete: this.handleDelete,
                        })}
                    />
                ))}
            </div>
        );
    }
}
