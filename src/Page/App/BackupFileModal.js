import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button, Label,
    Form, FormGroup, FormFeedback,
    Input,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

const form = {
    sourceFile: {
        label: 'Source file',
        component: Input,
        required: true,
        props: (props) => ({ placeholder: 'https://example.com/source.tar.gz' }),
        validate: (value) => value && value.match(new RegExp(/https?:\/\/(.*)\.tar\.gz$/))
    },

    databaseFile: {
        label: 'Database file',
        component: Input,
        required: true,
        props: (props) => ({ placeholder: 'https://example.com/database.sql.gz' }),
        validate: (value) => value && value.match(new RegExp(/https?:\/\/(.*)\.sql\.gz$/))
    }
}

export default class extends Component {
    state = {
        saving: false,
        valid: false,
        app: undefined,
        data: {
            sourceFile: undefined,
            databaseFile: undefined,
        },
        isInvalid: {},
        isRequired: {}
    };

    static propTypes = {
        app: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
    }

    onDataChange = (e, name) => {
        const value = e.target.value;
        const { data } = this.state;

        let valid = Object.keys(data).some(field => form[field]['validate'](data[field])),
            isInvalid = this.state.isInvalid;

        if ( value ) {
            valid = form[name]['validate'](value);
            isInvalid = { [name]: !valid };
        } else {
            isInvalid = { [name]: false };
        }

        this.setState({ valid, data: { ...data, [name]: value }, isInvalid });
    };

    submit = async (e) => {
        e.preventDefault();

        const files = Object.values(this.state.data).filter(v => !!v);

        this.setState({ saving: true });

        await this.props.onSubmit(files);

        this.setState({ saving: false });

        this.props.onClose();
    };

    render() {
        const { saving, isInvalid, valid } = this.state;

        return (
            <div>
                <Modal isOpen={this.props.isOpen}>
                    <ModalHeader>Import backup files</ModalHeader>
                    <ModalBody>
                        <Form>
                            {Object.keys(form).map((name, index) => {
                                const { label, props, component } = form[name];
                                return (
                                    <div key={index}>
                                        <Label>{label}</Label>
                                        <FormGroup {...(isInvalid[name] ? { color: 'danger' } : {})}>
                                            {React.createElement(component, {
                                                disabled: saving,
                                                onChange: e => this.onDataChange(e, name), ...(props(this.props))
                                            })}
                                            { isInvalid[name] && <FormFeedback>{label} is invalid</FormFeedback>}
                                        </FormGroup>
                                    </div>
                                )
                            })}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={!valid} onClick={this.submit}>Import</Button>
                        <Button className="btn-link" color="secondary" onClick={this.props.onClose}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

