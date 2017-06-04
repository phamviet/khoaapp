import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Container,
    Collapse,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav, NavItem,
    NavLink,
    Form,
    Button,
} from 'reactstrap';

import './Navbar.css';

export default class extends Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        onBrandClick: PropTypes.func.isRequired,
        onNavClick: PropTypes.func.isRequired,
        onButtonClick: PropTypes.func.isRequired
    }

    state = {
        open: false
    };

    render() {
        const { routes, onBrandClick, onNavClick, onButtonClick, ...others } = this.props;
        return (
            <Navbar color="faded" light toggleable {...others}>
                <NavbarToggler right onClick={() => {
                    this.setState({
                        open: !this.state.open
                    });
                }}/>

                <Container>
                    <NavbarBrand href="#" onClick={() => onBrandClick}>Khoaapp</NavbarBrand>
                    <Collapse isOpen={this.state.open} navbar>
                        <Nav navbar>
                            {routes.filter(r => r.nav).map((route, index) => (
                                <NavItem key={index} className="text-center">
                                    <NavLink onClick={() => onNavClick(route.path)}>{route.label}</NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                        <Form inline className="ml-auto hidden-sm-down">
                            <Button onClick={() => onButtonClick()} color="success">New Site</Button>
                        </Form>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

