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
        const response = await api.postJson(`/promos/apply/${code}`);

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
            <Card className="mt-4">
                <CardBlock>
                    <CardTitle>
                        Promo code
                    </CardTitle>
                    <CardText>
                        If you have a promo code, please enter it below to receive your credit.
                    </CardText>
                    <Form inline onSubmit={this.applyCode}>
                        <FormGroup {...(error ? { color: 'danger' } : {})}>
                            <Input value={code}
                                   onChange={e => this.setState({ code: e.target.value, error: '' })}
                                   size="lg" placeholder="Promo code"/>
                        </FormGroup>
                        <Button disabled={!code || disabled || invalid.hasOwnProperty(code)}
                                onClick={this.applyCode}
                                className="ml-2" size="lg" color="success">Apply code</Button>
                    </Form>
                    { !!error && <FormFeedback className="text-danger">{error}</FormFeedback>}
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
                    <Col sm="6">
                        <Card>
                            <CardBlock>
                                <dl className="">
                                    <dt>Email</dt>
                                    <dd>{profile.email}</dd>

                                    <dt >Member since</dt>
                                    <dd>{humanize.relativeTime(profile.created_at)}</dd>

                                    <dt >Last login</dt>
                                    <dd>{humanize.relativeTime(profile.last_login)}</dd>
                                </dl>
                            </CardBlock>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card>
                            <CardBlock style={{ height: '216px' }}>
                                <div style={{ padding: '15px 0' }}>
                                    <CardTitle>
                                        Your credit

                                        <div className="float-md-right text-right">
                                            ${profile.balance}
                                        </div>
                                    </CardTitle>
                                </div>
                                <div className="p-3">
                                    <PaypalButton env={config.paypalMode} onSuccess={this.onCreditAdded}/>
                                </div>
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
