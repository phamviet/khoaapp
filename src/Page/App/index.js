import React, { Component } from 'react';
import {
    Row,
    Col,
    Card, CardBlock,
    CardTitle,
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
                    <Col sm="1">

                    </Col>
                    <Col sm="5">
                        {app.name}
                        {' '}
                        <a ref="nofollow" target="_blank" href={`http://${app.name}`}>
                            <i className="fa fa-external-link"/>
                        </a>
                    </Col>

                    <Col sm="3">
                        {humanize.relativeTime(app.created_at)}
                    </Col>
                    <Col sm="3" className="text-right">
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
                <Card>
                    <CardBlock>
                        <div style={{ padding: '15px 0' }}>
                            <CardTitle>
                                Sites
                            </CardTitle>
                        </div>
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
