import React, { Component } from 'react';
import {
    Row,
    Col,
    Card, CardBlock,
    Button
} from 'reactstrap';
import humanize from 'humanize';

import api from '../../api';

class AppRow extends Component {
    state = {
        disabled: false
    };

    toggleState = () => {
        this.setState({ disabled: !this.state.disabled });
    };

    render() {
        const { app, onDestroyClick } = this.props;
        const { disabled } = this.state;

        return (
            <div>
                <Row>
                    <Col xs={12} sm="8">
                        {app.name}
                        {' '}
                        <a ref="nofollow" target="_blank" href={`http://${app.name}`}>
                            <i className="fa fa-external-link"/>
                        </a>
                        <br/>
                        <small className="text-muted">{humanize.relativeTime(app.created_at)}</small>
                    </Col>

                    <Col sm="4" className="text-right hidden-xs-down">
                        {/*<Button disabled={disabled} outline color="success">Backup</Button>{' '}*/}
                        <Button disabled={disabled} onClick={e => onDestroyClick(e, this.toggleState)} outline color="danger">Destroy</Button>
                    </Col>
                </Row>
                <hr/>
            </div>
        );
    }
}

class App extends Component {
    onDestroyClick = async (e, app, toggleState) => {
        if (!confirm('Are you sure you want to destroy this site and agree with data lost?')) {
            return;
        }

        toggleState();
        const destroy = await api.destroy(app.id);
        if ( destroy.ok ) {
            this.props.removeApp(app);
            this.props.alert(`"${app.name}" is successfully destroyed`);
        } else {
            toggleState();
        }
    };

    render() {
        const { apps } = this.props;

        return (
            <div>
                <h2 className="head">
                    Sites
                </h2>
                <hr/>

                <Card>
                    <CardBlock>
                        {apps.map(app => (
                            <AppRow key={app.id} app={app} onDestroyClick={(e, toggleState) => this.onDestroyClick(e, app, toggleState)} />
                        ))}
                    </CardBlock>
                </Card>
            </div>
        );
    }
}

export default App;
