import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

class Login extends Component {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired
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
            const data = await res.json();
            this.props.onSuccess(data);
        }
    };

    fblogin = (e) => {
        window.FB.login(this.fbVerify, { scope: 'email' });
    };

    render() {
        return (
            <div className="Page-login cover-wrapper">
                <div className="cover-wrapper-inner">
                    <div className="m-auto">
                        <Button onClick={this.fblogin} size="lg" color="primary">
                            <i className="fa fa-lg fa-facebook" aria-hidden="true"/>{' '}{' '}
                            Continue with Facebook
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
