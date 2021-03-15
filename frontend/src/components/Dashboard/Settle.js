import React, { Component } from 'react';
import { BrowserRouter, Link, NavLink } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'

class Settle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: this.props.data.userID,
            youOweList: []
        }
    }
}
export default Settle;