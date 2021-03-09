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
            totalBalance: null,
            totalYouOwe: null,
            totalYouAreOwed: null,
            youOweList: [],
            youAreOwedList: []
        }
    }

    componentWillMount() {
        this.setState({
            userID: parseInt(cookie.load('userID'))
        })
      }

    componentDidMount(){
        const data = {
            "userID": parseInt(cookie.load('userID'))
        }

        console.log(data);

        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/dashboard/total_balance/'+cookie.load('userID'))
            .then(response => {
                if(response.state === 200){
                    console.log(response.data);
                    this.setState({
                        totalBalance: response.data.TOTAL_BALANCE
                    })
                }
            }).catch(e => {
                console.log(e);
            })
        
            axios.get('http://localhost:3001/dashboard/total_you_owe/'+cookie.load('userID'))
            .then(response => {
                if(response.state === 200){
                    console.log(response.data);
                    this.setState({
                        totalYouOwe: response.data.TOTAL_AMOUNT
                    })
                }
            }).catch(e => {
                console.log(e);
            })

            axios.get('http://localhost:3001/dashboard/total_you_are_owed/'+cookie.load('userID'))
            .then(response => {
                if(response.state === 200){
                    console.log(response.data);
                    this.setState({
                        totalYouAreOwed: response.data.TOTAL_AMOUNT
                    })
                }
            }).catch(e => {
                console.log(e);
            })

            axios.get('http://localhost:3001/dashboard/you_are_owed/'+cookie.load('userID'))
            .then(response => {
                if(response.state === 200){
                    console.log(response.data);
                    this.setState({
                        youAreOwedList: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })

            axios.get('http://localhost:3001/dashboard/you_owe/'+cookie.load('userID'))
            .then(response => {
                if(response.state === 200){
                    console.log(response.data);
                    this.setState({
                        youOweList: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })

    }


    render() {
        let redirectVar = null;
        if(!cookie.load('userID')){
            redirectVar = <Redirect to= "/"/>
        }
        return (
            <div>
                {redirectVar}
                <BrowserRouter>
                    <div>
                        <Navbar />
                    </div>
                    <div class="container">
                        <h1>Dashboard</h1>
                        {/* <div class="row div-pad">
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
                        </div> */}
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
export default Dashboard;