import React, { Component } from 'react';
import {
    Row,
    Col,
    Card, CardBlock,
    CardTitle
} from 'reactstrap';
import humanize from 'humanize';
import PaypalButton from '../../Component/PaypalButton';

class Profile extends Component {
    onCreditAdded = ({ balance }) => {
        this.props.updateProfile({ balance });
    };

    render() {
        const { profile } = this.props;

        return (
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
                        <CardBlock style={{height: '216px'}}>
                            <div style={{ padding: '15px 0' }}>
                                <CardTitle>
                                    Your credit

                                    <div className="float-md-right text-right">
                                        ${profile.balance}
                                    </div>
                                </CardTitle>
                            </div>
                            <div className="p-3">
                                <PaypalButton onSuccess={this.onCreditAdded}/>
                            </div>
                        </CardBlock>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Profile;
