import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            authFlag: false,
            MsgFlag: false
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
        axios.post('http://localhost:3001/login', data)
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
                        Msg: "login success"
                    })
                } else if (response.status === 400) {
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
                            <span style={{ color: "#8a8f94"}}><strong>WELCOME TO SPLITWISE</strong></span><br/><br/>
                            <label><strong>Email address</strong></label>
                            <input class="form-input" onChange={this.emailChangeHandler} type="text" class="form-control" name="email" required></input>
                            <br/>
                            <label><strong>Password</strong></label>
                            <input class="form-input" onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" required></input>
                            <br/>
                            <a class="btn btn-primary" type="button" onClick={this.submitLogin} style={{ backgroundColor: "#ed752f", border: "none" }}>Log In</a>
                            {this.state.MsgFlag ? <p>{this.state.Msg}</p> : null}
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
export default Login;