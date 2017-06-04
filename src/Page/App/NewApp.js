import React, { Component } from 'react';

import {
    Link,
} from 'react-router-dom'

import {
    Button, Label,
    Form, FormGroup, FormFeedback,
    Input, InputGroup, InputGroupAddon,
    Card, CardBlock, CardTitle, CardImg, CardDeck
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';

import api from '../../api';
import wordpressLogo from '../../assets/wordpress-logo.png';

class NewApp extends Component {
    state = {
        saving: false,
        submitted: false,
        data: {
            domain: '',
            type: 1,
            wildcard: false,
            subdomain: '',
            blogTitle: 'My Blog',
            adminEmail: '',
            adminUser: '',
            adminPassword: '',
        },
        domains: [],
        isRequired: {},
    };

    componentWillMount() {
        this.setState({ data: { ...this.state.data, adminEmail: this.props.profile.email } });
    }

    componentDidMount() {
        this.loadDomainList();
    }

    async loadDomainList() {
        const res = await api.get('/domain');
        if ( res.ok ) {
            const domains = await res.json();
            const domain = domains.length === 1 ? domains[0]['name'] : this.state.domain;

            this.setState({ domains, data: { ...this.state.data, domain } })
        }
    };

    onDataChange = (e, name) => {
        const value = e.target.value;
        this.setState({ data: { ...this.state.data, [name]: value } }, () => this.state.submitted && this.validate());
    };

    toggleWildcard = () => {
        this.setState({ data: { ...this.state.data, wildcard: !this.state.data.wildcard } });
    };

    setAppType = (val) => {
        this.setState({ data: { ...this.state.data, type: val } });
    };

    submit = async (e) => {
        e.preventDefault();

        const { history, alert, addApp, profile, updateProfile } = this.props;

        const { data } = this.state;

        this.setState({ submitted: true });

        if ( !this.validate() ) {
            return;
        }

        this.setState({ saving: true });

        const response = await api.post('/app/create', data);
        const json = await response.json();

        if ( response.ok ) {
            addApp(json);
            alert(`Your site ${json.name} was deployed successfully.`);

            // Update credit
            const res = await api.getUser(profile.id);
            if ( res.ok ) {
                const data = await res.json();
                updateProfile(data);
            }

            this.setState({ saving: false, submitted: false }, () => history.push('/'));
        } else {
            if ( response.status > 400 && response.status < 500 ) {
                alert(json.message || '', 'danger');
            }

            this.setState({ saving: false });
        }
    };

    validate() {
        const { data } = this.state;

        const requiredFields = data.type === 1 ? ['domain', 'blogTitle', 'adminEmail', 'adminUser', 'adminPassword'] : ['domain'];
        let isRequired = {};

        requiredFields.forEach(field => {
            if ( !data[field] ) {
                isRequired[field] = true;
            }
        });

        this.setState({ isRequired });

        return Object.keys(isRequired).length === 0;
    }

    render() {
        const { saving, isRequired, domains, data } = this.state;

        return (
            <div>
                <Card>
                    <CardBlock>
                        <CardTitle>New site</CardTitle>
                        <hr/>
                        <Form onSubmit={this.submit}>
                            <FormGroup {...(isRequired.domain ? { color: 'danger' } : {})}>
                                <Label>Domain</Label>
                                <Input type="select"
                                       disabled={saving}
                                       value={data.domain}
                                       onChange={e => this.onDataChange(e, 'domain')}
                                >
                                    <option value="">Select a domain</option>
                                    {domains.map(domain => (
                                        <option
                                            key={domain.name}
                                            value={domain.name}
                                        >
                                            {domain.name}
                                        </option>
                                    ))}
                                </Input>
                                { isRequired.domain && <FormFeedback>Please select a domain</FormFeedback>}

                            </FormGroup>
                            {data.domain && (
                                <div>
                                    <FormGroup>
                                        <Label>Subdomain</Label>
                                        <InputGroup>
                                            <Input
                                                placeholder="Optional"
                                                disabled={saving}
                                                value={data.subdomain}
                                                onChange={e => this.onDataChange(e, 'subdomain')}
                                            />
                                            <InputGroupAddon>.{data.domain}</InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                </div>
                            )}

                            <h5 className="mt-4">Choose app</h5>
                            <hr/>
                            <div className="card-apps">
                                <CardDeck>
                                    <Card onClick={() => this.setAppType(1) } block outline color={data.type === 1 ? 'info' : ''} className="text-center mb-3 mb-sm-0">
                                        <CardImg className="m-auto" top width="199" src={wordpressLogo} alt="Wordpress"/>
                                    </Card>

                                    <Card onClick={() => this.setAppType(2) } block outline color={data.type === 2 ? 'info' : ''} className="text-center mb-3 mb-sm-0">
                                        <CardImg className="m-auto" top width="199" src="https://ghost.org/logo.svg" alt="Ghost"/>
                                    </Card>

                                    <Card onClick={() => this.setAppType(0) } block outline color={data.type === 0 ? 'info' : ''} className="text-center">
                                        <FontAwesome name='cubes' size="4x" />
                                        <br/>
                                        <CardTitle>Empty</CardTitle>
                                    </Card>
                                </CardDeck>

                            </div>

                            {data.type === 1 ? (
                                <div>
                                    <h5 className="mt-4">Wordpress setup</h5>
                                    <hr/>

                                    <Label>Site title</Label>
                                    <FormGroup {...(isRequired.blogTitle ? { color: 'danger' } : {})}>
                                        <Input disabled={saving}
                                               value={data.blogTitle}
                                               onChange={e => this.onDataChange(e, 'blogTitle')}
                                               autoComplete="off"/>
                                        { isRequired.blogTitle && <FormFeedback>Site title is required</FormFeedback>}
                                    </FormGroup>

                                    <Label>Admin email</Label>
                                    <FormGroup {...(isRequired.adminEmail ? { color: 'danger' } : {})}>
                                        <Input disabled={saving}
                                               type="email"
                                               value={data.adminEmail}
                                               onChange={e => this.onDataChange(e, 'adminEmail')}
                                               autoComplete="off" placeholder="Email"/>
                                        { isRequired.adminEmail && <FormFeedback>Admin email is required</FormFeedback>}
                                    </FormGroup>

                                    <Label>Admin user</Label>
                                    <FormGroup {...(isRequired.adminUser ? { color: 'danger' } : {})}>
                                        <Input disabled={saving}
                                               onChange={e => this.onDataChange(e, 'adminUser')}
                                               autoComplete="off" placeholder="Username"/>
                                        { isRequired.adminUser && <FormFeedback>Admin user is required</FormFeedback>}
                                    </FormGroup>

                                    <Label>Admin password</Label>
                                    <FormGroup {...(isRequired.adminPassword ? { color: 'danger' } : {})}>
                                        <Input disabled={saving}
                                               type="password"
                                               onChange={e => this.onDataChange(e, 'adminPassword')}
                                               autoComplete="off" placeholder="Password"/>
                                        { isRequired.adminPassword && <FormFeedback>Admin password is required</FormFeedback>}
                                    </FormGroup>
                                </div>
                            )
                                : data.type === 0 ? (
                                    <div>
                                        <h5 className="mt-4">App settings</h5>
                                        <hr/>
                                        {data.domain && (
                                            <div>
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input onClick={() => this.toggleWildcard()} checked={data.wildcard} type="checkbox" />{' '}
                                                        Multi sites domain
                                                    </Label>
                                                </FormGroup>
                                            </div>
                                        )}
                                    </div>
                                ) : <br/>}


                            <div className="text-center">
                                <Button type="submit" disabled={saving} onClick={this.submit}
                                        color="success">Deploy</Button>
                                {' '}
                                <Link to="/" className="btn btn-link">Back</Link>
                            </div>
                        </Form>
                    </CardBlock>
                </Card>

            </div>
        );
    }
}

export default NewApp;
