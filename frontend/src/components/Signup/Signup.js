import React, { Component } from 'react';
import '../../App.css';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import { BrowserRouter, Link } from 'react-router-dom';
import config from "../../config.json";
import { useHistory } from 'react-router-dom';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "",
            name: "",
            email: "",
            password: "",
            Msg: "",
            MsgFlag: false
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
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
    nameChangeHandler = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    submitSignup = (e) => {
        e.preventDefault();
        const data = {
            userName: this.state.name,
            userEmail: this.state.email,
            userPassword: this.state.password
        }
        axios.defaults.withCredentials = true;
        axios.post(config.API_URL + '/signup', data)
            .then(response => {
                console.log("=========Inside frontend===========");
                console.log("Status Code: ", response.status);
                console.log(response.data);
                if (response.status === 200) {
                    console.log("Sign up success");
                    this.setState({
                        MsgFlag: false,
                        Msg: "Sign up success",
                        userID: response.data.userID
                    })
                    // this.props.history.push("/login")
                    const data = {
                        userEmail: this.state.email,
                        userPassword: this.state.password
                    }
                    axios.defaults.withCredentials = true;
                    // axios.post('http://localhost:3001/login', data)
                    axios.post(config.API_URL + '/login', data)
                        .then(response => {
                            console.log("=========Inside frontend===========");
                            console.log("Status Code: ", response.status);
                            console.log(response.data);
                            if (response.status === 200) {
                                //redirect to dashboard
                                console.log(response.data);
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
                                console.log(response.data);
                                this.setState({
                                    authFlag: true,
                                    MsgFlag: true,
                                    Msg: "Invalid Credentials"
                                })
                            } else {
                                //login failed
                                console.log(response.data);
                                this.setState({
                                    authFlag: true,
                                    MsgFlag: true,
                                    Msg: "Login Failed"
                                })
                            }
                        }).catch(e => {
                            console.log("Inside catch");
                        })
                }
                else if (response.status === 201) {
                    console.log("Email ID already registered");
                    this.setState({
                        Msg: "Email ID already registered",
                        MsgFlag: true
                    })
                    console.log("=============");
                    console.log(this.state.MsgFlag);
                    console.log(this.state.Msg);
                }
                else {
                    console.log("Sign up failed");
                    this.setState({
                        Msg: "Sign up failed",
                        MsgFlag: true
                    })
                }
            })
    }
    render() {
        let redirectVar = null;
        if (cookie.load('userID')) {
            redirectVar = <Redirect to="/dashboard" />
        }
        return (
            <div>
                {redirectVar}
                <BrowserRouter>
                    <div>
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
                                    <span style={{ color: "#8a8f94" }}><strong>INTRODUCE YOURSELF</strong></span><br /><br />
                                    <form onSubmit={this.submitSignup} method="post">
                                        <label><strong>Hi there! My name is</strong></label>
                                        <input class="form-input" onChange={this.nameChangeHandler} type="text" class="form-control" name="name" required></input>
                                        <br />
                                        <label><strong>Email address</strong></label>
                                        <input class="form-input" onChange={this.emailChangeHandler} type="email" class="form-control" name="email" required></input>
                                        <br />
                                        <label><strong>Password</strong></label>
                                        <input class="form-input" onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" required></input>
                                        <br />
                                        <button class="btn btn-primary btn-lg" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }}>Sign me up!</button>
                                    </form>
                                    <br />
                                    {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.Msg}</div> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
export default Signup;