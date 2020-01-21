import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './AppHeader.css';

const AppHeader = props => {
    return (
        <header className="title">
            <h1>Todo APP</h1>
            <nav>
                <Link to="/">My todos</Link><br/>
                <Link to="/about">About this app</Link><br/>
                <Link to="/contact">Contact</Link><br/>
            </nav>
        </header>
    );
};

AppHeader.propTypes = {};
AppHeader.defaultProps = {};

export default AppHeader;
