import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userLogin } from '../../actions/loginAction'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    componentWillMount() {
        this.setState({
            authFlag: false,
            MsgFlag: false //
        })
    }
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    submitLogin = (e) => {
        e.preventDefault();
        const data = {
            userEmail: this.state.email,
            userPassword: this.state.password
        }
        console.log(data);
        this.props.userLogin(data);
    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Navbar />
                </div>
                <div class="container">
                    <div class="row div-pad">
                        <div class="col-3"></div>
                        <div class="col-3">
                            <img src={splitwise_logo} width="250" height="250" alt="" />
                        </div>
                        <div class="col-3">
                            <span style={{ color: "#8a8f94" }}><strong>WELCOME TO SPLITWISE</strong></span><br /><br />
                            <form onSubmit={this.submitLogin} method="post" action="/signup">
                                <label for="inputEmail"><strong>Email address</strong></label>
                                <input class="form-input" onChange={this.emailChangeHandler} type="email" id="inputEmail" class="form-control" name="email" required></input>
                                <br />
                                <label for="inputPassword"><strong>Password</strong></label>
                                <input class="form-input" id="inputPassword" onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" required></input>
                                <br />
                                <button class="btn btn-primary" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }}>Log In</button>
                            </form>
                            <br></br>
                            {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.Msg}</div> : null}
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

Login.propTypes = {
    userLogin: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return ({
        user: state.login.user
    })
}

export default connect(mapStateToProps, { userLogin })(Login);