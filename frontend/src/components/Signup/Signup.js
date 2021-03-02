import React, { Component } from 'react';
import '../../App.css';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import { BrowserRouter, Link } from 'react-router-dom';

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
        axios.post('http://localhost:3001/signup', data)
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
        return (
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
                                <br/>
                                {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.Msg}</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
export default Signup;