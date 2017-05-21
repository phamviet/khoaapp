import React, { Component } from 'react';
import {
    Card,
    CardBlock,
    CardTitle
} from 'reactstrap';
import {
    Link,
} from 'react-router-dom'

import { Button, Label, Form, FormGroup, FormText, FormFeedback, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import api from '../../api';

class NewApp extends Component {
    state = {
        saving: false,
        submitted: false,
        data: {
            domain: '',
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
        if (res.ok) {
            const domains = await res.json();
            const domain = domains.length === 1 ? domains[0]['name'] : this.state.domain;

            this.setState({domains, data: {...this.state.data, domain}})
        }
    };

    onDataChange = (e, name) => {
        const value = e.target.value;
        this.setState({ data: {...this.state.data, [name]: value} }, () => this.state.submitted && this.validate());
    };

    submit = async (e) => {
        e.preventDefault();

        const { history, alert, addApp, profile, updateProfile } = this.props;

        const {data} = this.state;

        this.setState({ submitted: true });

        if (!this.validate()) {
            return;
        }

        this.setState({ saving: true });

        const response = await api.post('/app/create', data);
        const json = await response.json();

        if (response.ok) {
            addApp(json);
            alert(`Your site ${json.name} was deployed successfully.`);

            // Update credit
            const res = await api.getUser(profile.id);
            if (res.ok) {
                const data = await res.json();
                updateProfile(data);
            }

            this.setState({ saving: false, submitted: false }, () => history.push('/'));
        } else {
            if (response.status > 400 && response.status < 500) {
                alert(json.message || '', 'danger');
            }

            this.setState({ saving: false });
        }
    };

    validate() {
        const {data} = this.state;
        const { subdomain, ...requiredFields } = data;

        let isRequired = {};

        Object.keys(requiredFields).forEach(field => {
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
                            <FormGroup {...(isRequired.domain ? {color: 'danger'}: {})}>
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
                                    <FormText color="muted">
                                        Leave blank to use chose domain.
                                    </FormText>
                                </FormGroup>
                            )}

                            <h5 className="mt-4">Site setup</h5>
                            <hr/>

                            <Label>Site title</Label>
                            <FormGroup {...(isRequired.blogTitle ? {color: 'danger'}: {})}>
                                <Input disabled={saving}
                                       value={data.blogTitle}
                                       onChange={e => this.onDataChange(e, 'blogTitle')}
                                       autoComplete="off" />
                                { isRequired.blogTitle && <FormFeedback>This field is required</FormFeedback>}
                            </FormGroup>

                            <h5 className="mt-4">Admin account</h5>
                            <hr/>
                            <Label>Email</Label>
                            <FormGroup {...(isRequired.adminEmail ? {color: 'danger'}: {})}>
                                <Input disabled={saving}
                                       type="email"
                                       value={data.adminEmail}
                                       onChange={e => this.onDataChange(e, 'adminEmail')}
                                       autoComplete="off" placeholder="Email"/>
                                { isRequired.adminEmail && <FormFeedback>This field is required</FormFeedback>}
                            </FormGroup>

                            <Label>Username</Label>
                            <FormGroup {...(isRequired.adminUser ? {color: 'danger'}: {})}>
                                <Input disabled={saving}
                                       onChange={e => this.onDataChange(e, 'adminUser')}
                                       autoComplete="off" placeholder="Username"/>
                                { isRequired.adminUser && <FormFeedback>This field is required</FormFeedback>}
                            </FormGroup>

                            <Label>Password</Label>
                            <FormGroup {...(isRequired.adminPassword ? {color: 'danger'}: {})}>
                                <Input disabled={saving}
                                       type="password"
                                       onChange={e => this.onDataChange(e, 'adminPassword')}
                                       autoComplete="off" placeholder="Password"/>
                                { isRequired.adminPassword && <FormFeedback>This field is required</FormFeedback>}
                            </FormGroup>
                            <Button type="submit" disabled={saving} onClick={this.submit} color="success">Deploy</Button>
                            {' '}
                            <Link to="/" className="btn btn-link">Back</Link>
                        </Form>
                    </CardBlock>
                </Card>

            </div>
        );
    }
}

export default NewApp;
