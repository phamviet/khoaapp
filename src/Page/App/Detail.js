import React, { Component } from 'react';

import {
    Button,
    Card,
    CardBlock,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import humanize from 'humanize';

import api from '../../api';
import BackupFileModal from './BackupFileModal';

class Detail extends Component {
    state = {
        saving: false,
        app: undefined,
        modal: {
            importBackup: false
        }
    };

    componentWillMount() {
        const { match } = this.props;
        if (match.params.id) {
            this.load(match.params.id);
        }
    }

    load = async (id) => {
        const res = await api.get( `/app/${id}?full=1` );
        if (res.ok) {
            const app = await res.json();
            this.setState({app})
        }
        return res
    };

    toggleModal = (name) => {
        this.setState({modal: {...this.state.modal, [name]: !this.state.modal[name]}})
    };

    handleBackup = async (files = []) => {
        const { alert } = this.props;
        const { app } = this.state;

        if (!confirm('Are you sure you want to backup this site?')) {
            return;
        }

        this.setState({ saving: true });

        const response = await api.post(`/app/${app.id}/backup`, { files });

        if ( response.ok ) {
            alert('Backup is in progress');
            const data = await response.json()

            this.setState({ app: {...app, backups: {...app.backups, [data.timestamp]: {} }} });
        }

        this.setState({ saving: false });
    };

    async handleRestore (timestamp) {

        const { alert } = this.props;
        const { app } = this.state;

        if (!confirm('Are you sure you want to restore to this version?')) {
            return;
        }

        this.setState({ saving: true });
        const response = await api.post(`/app/${app.id}/restore/${timestamp}`);

        if (response.ok) {
            alert('Restore is in progress');
        }

        this.setState({ saving: false });
    }

    async handleDeleteBackup (timestamp) {

        const { alert } = this.props;
        const { app } = this.state;

        if (!confirm('Are you sure you want to delete this backup?')) {
            return;
        }

        this.setState({ saving: true });

        const response = await api.delete(`/app/${app.id}/backup/${timestamp}`);

        if (response.ok) {
            alert('Backup was successfully deleted.');
        }

        let backups = { ...app.backups };

        if (response.ok) {
            delete backups[timestamp];
        }

        this.setState({ saving: false, app: {...app, backups} });
    }

    render() {
        const { saving, app } = this.state;

        if (!app) {
            return null;
        }

        return (
            <div>
                <h2 className="head">
                    {app.name}{' '}
                    <a ref="nofollow" target="_blank" href={`http://${app.name}`}>
                        <small style={{fontSize: 14}}>
                            <FontAwesome name="external-link" />
                        </small>
                    </a>
                </h2>
                <hr/>

                <Card>
                    <CardBlock>
                        <h4 className="head mb-4">Backups</h4>
                        {Object.keys(app.backups).map(timestamp => {
                            return (
                               <div key={timestamp}>
                                   <div className="row">
                                       <div className="col-sm-6">
                                           {humanize.relativeTime(timestamp)}
                                       </div>
                                       <div className="col-sm-6 text-right">
                                           <Button onClick={() => this.handleRestore(timestamp)} disabled={saving}>Restore</Button>{' '}
                                           <Button outline color="danger" onClick={() => this.handleDeleteBackup(timestamp)} disabled={saving}>Delete</Button>
                                       </div>

                                   </div>
                                   <hr/>
                               </div>
                            )
                        })}
                        <Button disabled={saving} onClick={() => this.handleBackup()}>Backup</Button>{' '}
                        <Button disabled={saving} onClick={() => this.toggleModal('importBackup')}>Add backup files</Button>
                    </CardBlock>
                </Card>
                <BackupFileModal
                    app={app} isOpen={this.state.modal.importBackup}
                    onSubmit={this.handleBackup}
                    onClose={() => this.toggleModal('importBackup')}
                />
            </div>
        );
    }
}

export default Detail;
