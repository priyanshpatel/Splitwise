import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import config from "../../config.json";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            email: "",
            password: "",
            authFlag: false,
            MsgFlag: false,
            Msg: ""
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    componentWillMount() {
        this.setState({
            authFlag: false
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
        axios.defaults.withCredentials = true;
        // axios.post('http://localhost:3001/login', data)
        axios.post(config.API_URL + '/login', data)
            .then(response => {
                if (response.status === 200) {
                    //redirect to dashboard
                    this.setState({
                        authFlag: false,
                        MsgFlag: false,
                        Msg: "login success",
                        userID: response.data.userID
                    })
                    cookie.save('userID', response.data.userID, { path: '/' })
                    cookie.save('userEmail', response.data.userEmail, { path: '/' })
                    cookie.save('userName', response.data.userName, { path: '/' })
                    cookie.save('phoneNumber', response.data.phoneNumber, { path: '/' })
                    cookie.save('timezone', response.data.timezone, { path: '/' })
                    cookie.save('currency', response.data.currency, { path: '/' })
                    cookie.save('language', response.data.language, { path: '/' })
                    cookie.save('profilePicture', response.data.profilePicture, { path: '/' })
                    this.props.history.push("/dashboard")
                } else if (response.status === 201) {
                    //Invalid credentials
                    this.setState({
                        authFlag: true,
                        MsgFlag: true,
                        Msg: "Invalid Credentials"
                    })
                } else {
                    //login failed
                    this.setState({
                        authFlag: true,
                        MsgFlag: true,
                        Msg: "Login Failed"
                    })
                }
            }).catch(e => {
                console.log(e);
            })
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
                            <form onSubmit={this.submitLogin} method="post">
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
export default Login;