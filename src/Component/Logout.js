import React from 'react';
import PropTypes from 'prop-types';
import {
    withRouter,
} from 'react-router-dom'


import { NavLink } from 'reactstrap';

async function logout({history, onLoggedOut}) {
    const logout = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (logout.ok) {
        history.push('/');
        onLoggedOut();
    }
}
const Logout = withRouter(props => {
    return (
        <NavLink onClick={() => logout(props)} href="#">Logout</NavLink>
    )
});

Logout.propTypes = {
    onLoggedOut: PropTypes.func.isRequired
}

export default Logout;