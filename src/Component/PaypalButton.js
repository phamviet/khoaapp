import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import makeAsyncScriptLoader from  'react-async-script';
import PropTypes from 'prop-types';

let ReactButton;

class PaypalButton extends Component {
    static propTypes = {
        env: PropTypes.oneOf(['sandbox', 'production']).isRequired
    }

    client = {
        sandbox: 'Ac05KE8JVUUjOHSy6hSnb6F4r_lCgdATvyO-EkM1BCT53rZdS7vb3IQzc0EbAvVdapf2Jm44yK0tNk_p',
        production: 'AR7QWYYypS-OsK-Q_qylB1HidOJeJB4X0OfOxtJSqZmOJmHC88vG3XKnrllTVeWaO7TRASTkiYDjIPrB'
    }

    onScriptLoaded = () => {
        this.setState({ sdkLoaded: true });
        ReactButton = window.paypal.Button.driver('react', {
            React: React,
            ReactDOM: ReactDOM
        });
    }

    payment = (resolve, reject) => {
        window.paypal.request.post('/api/paypal/create-payment')
            .then(data => resolve(data.payment_id))
            .catch(reject);
    }

    /*
     intent : "sale"
     payerID : "UWYTJQ4JLF4DS"
     paymentID : "PAY-8GC54016X9791240GLEE35JY"
     paymentToken : "EC-03S59099JS516402Y"
     returnUrl : "http://docker.slim.dev/api/paypal/execute-payment/c0ad0f85-104a-4b7a-9d7a-4232fdb0c0a5?success=1&paymentId=PAY-8GC54016X9791240GLEE35JY&token=EC-03S59099JS516402Y&PayerID=UWYTJ
     * */
    onAuthorize = async ({ intent, payerID, paymentID, paymentToken, returnUrl }) => {
        const strippedUrl = returnUrl.replace('http://docker.slim.dev', '');
        const result = await window.paypal.request.post(strippedUrl, { payerID, paymentID });

        if ( result.success ) {
            this.props.onSuccess(result);
        }
    }

    onCancel = ({ paymentToken, cancelUrl }) => {
        const strippedUrl = cancelUrl.replace('http://docker.slim.dev', '');
        window.paypal.request.post(strippedUrl);
    }

    render() {
        return (
            <div>
                <PaypalSdk asyncScriptOnLoad={this.onScriptLoaded}/>
                {!!ReactButton && <ReactButton
                    env={this.props.env}
                    client={this.client}
                    payment={this.payment}
                    onAuthorize={this.onAuthorize}
                    onCancel={this.onCancel}
                    style={{ size: 'responsive' }}
                /> }
            </div>
        );
    }
}

const PaypalSdk = makeAsyncScriptLoader(() => (null), 'https://www.paypalobjects.com/api/checkout.js');

export default PaypalButton;
