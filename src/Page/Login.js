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
        js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.9&appId=652742791601830";
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
        window.FB.login(this.fbVerify, { scope: 'public_profile,email' });
    };

    render() {
        return (
            <div>
                <Button onClick={this.fblogin} outline color="primary">Login</Button>{' '}
            </div>
        );
    }
}

export default Login;
