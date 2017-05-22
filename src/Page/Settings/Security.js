import React, { Component } from 'react';
import {
    Col,
    Button,
    Form,
    FormGroup,
    Input
} from 'reactstrap';

import humanize from 'humanize';
import api from '../../api';

class UpdatePassword extends Component {
    state = {
        current_password: '',
        new_password: '',
        disabled: false,
        error: '',
    }

    update = async (e) => {
        e.preventDefault();
        const { profile } = this.props;
        const { current_password, new_password } = this.state;

        this.setState({ disabled: true });
        const response = await api.post(`/user/${profile.id}`, {current_password, new_password});
        const json = await response.json();

        if ( response.ok ) {
            this.props.alert(`Password updated successfully`);
            this.props.updateProfile({ password_updated_at: json.password_updated_at });
        } else {
            this.props.alert(json.message, 'danger');
        }

        this.setState({ disabled: false });
    };

    render() {
        const { current_password, new_password, disabled } = this.state;
        const { profile } = this.props;

        return (
            <div>
                <h2 className="head">
                    Update password
                </h2>
                <hr/>

                {profile.password_updated_at ? (
                    <p>
                        Last update: {humanize.relativeTime(profile.password_updated_at)}
                    </p>
                ) : '' }

                <Form onSubmit={this.update}>
                    {profile.password_updated_at &&
                    <FormGroup row>
                        <Col xs={12} sm={6}>
                            <Input value={current_password}
                                   type="password"
                                   onChange={e => this.setState({ current_password: e.target.value })}
                                   placeholder="Current password"/>
                        </Col>
                    </FormGroup>
                    }

                    <FormGroup row>
                        <Col xs={12} sm={6}>
                            <Input value={new_password}
                                   type="password"
                                   onChange={e => this.setState({ new_password: e.target.value })}
                                   placeholder="New password"/>
                        </Col>
                    </FormGroup>
                    <Button disabled={new_password.length < 6 || disabled}
                            onClick={this.update}
                            color="success">Update</Button>
                </Form>

            </div>
        );
    }
}

class Security extends Component {
    render() {
        return (
            <div>

                <UpdatePassword {...this.props} />
            </div>
        );
    }
}

export default Security;
