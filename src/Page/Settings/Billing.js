import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Card, CardBlock,
    CardTitle
} from 'reactstrap';

import PaypalButton from '../../Component/PaypalButton';

class Billing extends Component {

    render() {
        const { profile } = this.props;

        return (
            <Container>
                <Row>
                    <Col sm="6">
                        <Card>
                            <CardBlock>
                                <div style={{ padding: '15px 0' }}>
                                    <CardTitle>
                                        Your credit

                                        <div className="float-md-right text-right">
                                            ${profile.balance}
                                        </div>
                                    </CardTitle>
                                </div>
                                <PaypalButton/>
                            </CardBlock>
                        </Card>
                    </Col>

                </Row>
            </Container>
        );
    }
}

export default Billing;
