import React, { Component } from 'react';
import {
    Row,
    Col,
    Card, CardBlock,
    CardTitle,
    CardText,
    Button, Form, FormGroup, Input, FormFeedback
} from 'reactstrap';
import humanize from 'humanize';
import api from '../../api';
import PaypalButton from '../../Component/PaypalButton';

class PromoCode extends Component {
    state = {
        code: '',
        disabled: false,
        error: '',
        invalid: {}
    }

    applyCode = async (e) => {
        e.preventDefault();
        const code = this.state.code;

        this.setState({ disabled: true });
        const response = await api.post(`/promos/apply/${code}`);

        if ( response.ok ) {
            const { balance } = await response.json();
            this.props.updateProfile({ balance });
        } else {
            this.setState({ error: 'Invalid promo code', invalid: { ...this.state.invalid, [code]: true } })
        }

        this.setState({ disabled: false });
    };

    render() {
        const { code, disabled, error, invalid } = this.state;
        return (
            <Card className="mt-3">
                <CardBlock>
                    <CardTitle>
                        Promo code
                    </CardTitle>
                    <CardText>
                        If you have a promo code, please enter it below to receive your credit.
                    </CardText>
                    <Form onSubmit={this.applyCode}>
                        <FormGroup row {...(error ? { color: 'danger' } : {})}>
                            <Col xs={12} sm={8}>
                                <Input value={code}
                                       onChange={e => this.setState({ code: e.target.value, error: '' })}
                                       size="lg" placeholder="Promo code"/>
                                { !!error && <FormFeedback className="text-danger">{error}</FormFeedback>}
                            </Col>
                            <Col xs={12} sm={4} className="mt-2 mt-sm-0">
                                <Button block disabled={!code || disabled || invalid.hasOwnProperty(code)}
                                        onClick={this.applyCode}
                                        size="lg" color="success">Apply code</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </CardBlock>
            </Card>
        );
    }
}

class Profile extends Component {
    onCreditAdded = ({ balance }) => {
        this.props.updateProfile({ balance });
    };

    render() {
        const { profile, config } = this.props;

        return (
            <div>
                <Row>
                    <Col xs="12" sm="6">
                        <Card>
                            <CardBlock style={{ height: '216px' }}>
                                <dl className="">
                                    <dt>Email</dt>
                                    <dd>{profile.email}</dd>

                                    <dt >Member since</dt>
                                    <dd>{humanize.relativeTime(profile.created_at)}</dd>

                                    <dt >Last login</dt>
                                    <dd>{!!profile.last_login && humanize.relativeTime(profile.last_login)}</dd>
                                </dl>
                            </CardBlock>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" className="mt-3 mt-sm-0">
                        <Card>
                            <CardBlock style={{ height: '216px' }}>
                                <CardTitle>
                                    Your credit
                                    <div className="float-right text-right">
                                        ${profile.balance}
                                    </div>
                                </CardTitle>
                                <CardText>
                                    <br/>
                                    <p>
                                        Add <strong>$200</strong> PayPal credit to your account.
                                    </p>
                                    <PaypalButton env={config.paypalMode} onSuccess={this.onCreditAdded}/>
                                </CardText>
                            </CardBlock>
                        </Card>
                    </Col>
                </Row>

                <PromoCode {...this.props} />
            </div>
        );
    }
}

export default Profile;
