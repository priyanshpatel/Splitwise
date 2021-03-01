import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../../App.css';
import splitwise_home from '../../images/splitwise_home.png';
import splitwise_logo from '../../images/splitwise_logo.png';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    render() {
        let navLogin = null;
        if (cookie.load('cookie')) {
            console.log("Cookie can be read");
            navLogin = (
                <ul class="nav nabvar-nav navbar-right">
                    <a class="btn btn-primary" type="button" href="/" onClick = {this.handleLogout} style={{ backgroundColor: "#59cfa7", border: "none" }}>Logout</a>
                </ul>
            );
        } else {
            console.log("Cookie cannot be read");
            navLogin = (
                <nav class="navbar navbar-light bg-light">
                    <a class="nav-link landing-link" href="/login" style={{ color: "#59cfa7" }}><strong>Login</strong></a>
                    <a class="btn btn-primary" type="button" href="/signup" style={{ backgroundColor: "#59cfa7", border: "none" }}>Sign up</a>
                </nav>
            )
        }

        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container">
                        <a class="navbar-brand" href="#">
                            {/* <img src="https://lh3.googleusercontent.com/proxy/u5Jk4tgNiM-h3mYXjxrqeDClx4Qp5tyiMvrAdPrqaoaBt_obioNdG1FX1wL6K8yKsUyYpPEbp-zfcxeynL4K-RQiQ5hW-QBJWMURbAsn_NkqaFuOH0I" width="40" height="40" class="d-inline-block align-top" alt=""/> */}
                            <img src={splitwise_logo} width="40" height="40" class="d-inline-block align-top" alt="" href="/"/>
                            <span style={{ paddingLeft: "10px" }}><strong>Splitwise</strong></span>
                        </a>
                        {navLogin}
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;