import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Form, FormGroup, FormFeedback, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import api from '../api';

class Login extends Component {
    state = {
        signing: false,
        error: '',
        email: '',
        password: ''
    }

    static propTypes = {
        onSuccess: PropTypes.func
    }

    componentWillMount() {
        this.loadFacebookSdk();
    }

    loadFacebookSdk() {
        const id = 'facebook-jssdk';
        const fjs = window.document.getElementsByTagName('script')[0];
        if ( window.document.getElementById(id) ) return;

        const js = window.document.createElement('script');
        js.id = id;
        js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.9&appId=" + this.props.config.fbAppId;
        fjs.parentNode.insertBefore(js, fjs);
    }

    login = async (e) => {
        e.preventDefault();
        console.log('login');

        if ( !this.isValid() ) {
            return;
        }
        const { email, password } = this.state;

        this.setState({ signing: true });
        const res = await api.login(email, password);

        this.setState({ signing: false });

        if (res.ok) {
            await this.props.startApp();
            this.props.history.push('/');
        } else {
            const json = await res.json();
            this.setState({ error: json.message });
        }
    };

    isValid() {
        const { email, password } = this.state;

        if ( email.length === 0 || email.indexOf('@') === -1 ) {
            return false;
        }

        return password.length > 5;
    }

    fbVerify = async (response) => {
        if ( response.status !== 'connected' ) {
            return;
        }

        const res = await fetch(`/login/facebook/${response.authResponse.accessToken}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
        });

        if ( res.status === 200 ) {
            await this.props.startApp();
            this.props.history.push('/');
        }
    };

    fblogin = (e) => {
        window.FB.login(this.fbVerify, { scope: 'email' });
    };

    render() {
        const { signing, email, password, error } = this.state;

        return (
            <div className="Page-login">
                <div className="mx-auto text-center" style={{ maxWidth: '300px' }}>
                    <h1 className="py-5 text-muted" style={{ fontWeight: 200 }}>Khoaapp</h1>

                    <Form className="my-4" onSubmit={this.login}>

                        <FormGroup>
                            { !!error && <FormFeedback className="text-danger">{error}</FormFeedback>}
                        </FormGroup>

                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon><span className="fa fa-user-o"/></InputGroupAddon>
                                <Input disabled={signing}
                                       type="email"
                                       value={email}
                                       onChange={e => this.setState({ email: e.target.value })}
                                       autoComplete="off"
                                       placeholder="Email"/>
                            </InputGroup>
                        </FormGroup>

                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon><span className="fa fa-lock"/></InputGroupAddon>
                                <Input disabled={signing}
                                       type="password"
                                       value={password}
                                       onChange={e => this.setState({ password: e.target.value })}
                                       autoComplete="off" placeholder="Password"/>
                            </InputGroup>
                        </FormGroup>
                        <Button block type="submit"
                                disabled={signing || !this.isValid()}
                                onClick={this.login}>Sign in</Button>
                    </Form>

                    <hr/>
                    <h6 className="text-muted">OR</h6>

                    <Button className="mt-4" block onClick={this.fblogin} size="lg" color="primary">
                        <i className="fa fa-lg fa-facebook" aria-hidden="true"/>{' '}{' '}
                        Continue with Facebook
                    </Button>
                </div>
            </div>
        );
    }
}

export default Login;
