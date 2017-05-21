import React, { Component } from 'react';

import {
    Card, 
    CardBlock,
    Button,
    Form, 
    FormGroup, 
    Input, 
    Label, 
    FormFeedback
} from 'reactstrap';

import {
    Link,
} from 'react-router-dom'

import api from '../../api';

class Domain extends Component {
    state = {
        data: {
            name: '',
        },
        submitting: false,
        isRequired: {},
    };

    componentWillMount() {
        const { match } = this.props;
        if (match.params.id) {
            this.load(match.params.id);
        }
    }

    async load(id) {
        const res = await api.get( `/domain/${id}` );
        if (res.ok) {
            const domain = await res.json();
            this.setState({data: domain})
        }
    };

    onDataChange = (e, name) => {
        const value = e.target.value;
        this.setState({data: {...this.state.data, [name]: value}});
    };

    submit = async (e) => {
        e.preventDefault();
        const { data } = this.state;
        const { match: {params}, history, onSet, alert } = this.props;
        let isRequired = {};

        ['name'].forEach(field => {
            if ( !data[field] ) {
                isRequired[field] = true;
            }
        });

        this.setState({ isRequired });

        if (Object.keys(isRequired).length) {
            return;
        }

        this.setState({ submitting: true });
        
        let res;
        
        if (params.id) {
            res = await api.post(`/domain/${params.id}`, data);
        } else {
            res = await api.post('/domain/create', data);
        }

        this.setState({ submitting: false });

        const json = await res.json();

        if (res.ok) {
            onSet(json);
            history.push('/domains');
        } else {
            json.message && alert(json.message, 'warning')
        }
    }

    render() {
        const { submitting, isRequired, data } = this.state;

        return (
            <div>
                <Card>
                    <CardBlock className="col-sm-9 col-xs-12">
                        <Form onSubmit={this.submit}>
                            <FormGroup {...(isRequired.name ? {color: 'danger'}: {})}>
                                <Label>Domain</Label>
                                <Input disabled={submitting}
                                       onChange={e => this.onDataChange(e, 'name')}
                                       autoComplete="off"
                                       value={data.name}
                                       placeholder="Enter domain name"/>
                                { isRequired.name && <FormFeedback>Please enter domain name</FormFeedback>}
                            </FormGroup>

                            <Button type="submit" disabled={submitting} onClick={this.submit} color="success">Add</Button>
                            {' '}
                            <Link to="/domains" className="btn btn-link">Back</Link>
                        </Form>
                    </CardBlock>
                </Card>
            </div>
        );
    }
}

export default Domain;