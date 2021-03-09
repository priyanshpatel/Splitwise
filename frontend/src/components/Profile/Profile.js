import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            userName: null,
            userEmail: null,
            phoneNumber: null,
            timezone: null,
            currency: null,
            language: null,
            profilePicture: null
        }
    }
}