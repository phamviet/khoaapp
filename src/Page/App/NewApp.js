import React, { Component } from 'react';
import { Card, CardBlock, CardTitle } from 'reactstrap';
import {
    Link,
} from 'react-router-dom'

import { Button, Label, Form, FormGroup, FormFeedback, Input } from 'reactstrap';
import api from '../../api';

class NewApp extends Component {
    state = {
        name: '',
        saving: false,
        data: {
            blogTitle: 'My Blog',
            adminEmail: '',
            adminUser: '',
            adminPassword: '',
        },
        isRequired: {},
    };

    onNameChange = (e) => {
        const name = e.target.value;
        this.setState({ name });
    };
    onDataChange = (e, name) => {
        const value = e.target.value;
        this.setState({ data: {...this.state.data, [name]: value} });
    };

    submit = async (e) => {
        e.preventDefault();

        const { history, alert, addApp } = this.props;

        const {name, data} = this.state;
        let isRequired = {};

        Object.keys(data).forEach(field => {

            if ( !data[field] ) {
                isRequired[field] = true;
            }
        });

        this.setState({ isRequired });

        if (Object.keys(isRequired).length) {
            return;
        }

        this.setState({ saving: true });

        const response = await api.create(name, data);
        const json = await response.json();

        if (response.ok) {
            addApp(json);
            alert('New site successful created');
            this.setState({ saving: false }, () => history.push('/'));
        } else {
            if (response.status > 400 && response.status < 500) {
                alert(json.message || '', 'danger');
            }

            this.setState({ saving: false });
        }
    };
    render() {
        const { saving, isRequired, data } = this.state;

        return (
            <div>
                <Card>
                    <CardBlock>
                        <CardTitle>New site</CardTitle>
                        <hr/>
                        <Form onSubmit={this.submit}>

                            <FormGroup>
                                <Input disabled={saving}
                                       size="lg"
                                       onChange={this.onNameChange}
                                       autoComplete="off" placeholder="Domain (Optional)"/>
                            </FormGroup>
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

                            <Label>Admin Email</Label>
                            <FormGroup {...(isRequired.adminEmail ? {color: 'danger'}: {})}>
                                <Input disabled={saving}
                                       type="email"
                                       onChange={e => this.onDataChange(e, 'adminEmail')}
                                       autoComplete="off" placeholder="Email"/>
                                { isRequired.adminEmail && <FormFeedback>This field is required</FormFeedback>}
                            </FormGroup>

                            <Label>Admin Username</Label>
                            <FormGroup {...(isRequired.adminUser ? {color: 'danger'}: {})}>
                                <Input disabled={saving}
                                       onChange={e => this.onDataChange(e, 'adminUser')}
                                       autoComplete="off" placeholder="Username"/>
                                { isRequired.adminUser && <FormFeedback>This field is required</FormFeedback>}
                            </FormGroup>

                            <Label>Admin Password</Label>
                            <FormGroup {...(isRequired.adminPassword ? {color: 'danger'}: {})}>
                                <Input disabled={saving}
                                       type="password"
                                       onChange={e => this.onDataChange(e, 'adminPassword')}
                                       autoComplete="off" placeholder="Password"/>
                                { isRequired.adminPassword && <FormFeedback>This field is required</FormFeedback>}
                            </FormGroup>
                            <Button type="submit" disabled={saving} onClick={this.submit} color="success">Create</Button>
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
