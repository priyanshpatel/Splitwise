import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import Modal from 'react-modal';
import Settle from "./Settle"

const customStyles = {
    content: {
      top: "40%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      height: "250px",
      width: "500px",
      transform: "translate(-50%, -50%)",
    },
  };

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            totalBalance: null,
            totalYouOwe: null,
            totalYouAreOwed: null,
            youOweList: [],
            youAreOwedList: [],
            settleUpPopUp: false
        }
    }

    componentWillMount() {
        this.setState({
            userID: parseInt(cookie.load('userID'))
        })
    }

    componentDidMount() {
        const data = {
            "userID": parseInt(cookie.load('userID'))
        }

        console.log(data);

        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/dashboard/total_balance/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        totalBalance: response.data.TOTAL_BALANCE
                    })
                }
                // console.log("<<<<<<<<<<Response data>>>>>>>>>");
                // console.log(response);
            }).catch(e => {
                console.log(e);
            })

        axios.get('http://localhost:3001/dashboard/total_you_owe/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        totalYouOwe: response.data.TOTAL_AMOUNT
                    })
                }
            }).catch(e => {
                console.log(e);
            })

        axios.get('http://localhost:3001/dashboard/total_you_are_owed/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        totalYouAreOwed: response.data.TOTAL_AMOUNT
                    })
                }
            }).catch(e => {
                console.log(e);
            })

        axios.get('http://localhost:3001/dashboard/you_are_owed/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        youAreOwedList: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })

        axios.get('http://localhost:3001/dashboard/you_owe/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    console.log("[[[[[[[[[inside if]]]]]]]]]]");
                    console.log(response.data);
                    this.setState({
                        youOweList: response.data
                    })
                }
                console.log("[[[[[[[[[you owe]]]]]]]]]]");
                console.log(response.status);
                console.log(response.data);
            }).catch(e => {
                console.log(e);
            })

    }

    toggleSettleUp = () => {
        console.log("ADD EXPENSE");
        console.log(this.state.settleUpPopUp);
        this.setState({
            settleUpPopUp: !this.state.settleUpPopUp
        })
    }


    render() {
        console.log("INSIDE RENDER>>>>>>>>>>>>>>>>>>");
        console.log(this.state.totalBalance);
        console.log(this.state.youOweList);
        let redirectVar = null;
        if (!cookie.load('userID')) {
            redirectVar = <Redirect to="/" />
        }

        let total_balance = this.state.totalBalance;
        let prefix = '+$'
        if (total_balance < 0) {
            prefix = '-$'
        }

        let youOweList = <div>You don't owe anything</div>
        if (this.state.youOweList != null) {
            youOweList = this.state.youOweList.map((youOwe) => {
                // return <div class="p-3 border bg-light">{invite}</div>;
                return <div class="card text-dark bg-light" style={{ width: '38rem' }}>
                    <div class="card-body">
                        <h6 class="card-title">You owe <strong>{youOwe.USER_NAME} <span style={{ color: "#ed752f" }}>${youOwe.TOTAL_AMOUNT}</span></strong></h6>
                    </div>
                </div>
            })
        }

        let youAreOwedList = <div>You are not owed anything</div>
        if (this.state.youAreOwedList != null) {
            youAreOwedList = this.state.youAreOwedList.map((youAreOwed) => {
                // return <div class="p-3 border bg-light">{invite}</div>;
                return <div class="card text-dark bg-light" style={{ width: '38rem' }}>
                    <div class="card-body">
                        <h6 class="card-title"><strong>{youAreOwed.USER_NAME}</strong> owes you <strong><span style={{ color: "#59cfa7" }}>${youAreOwed.TOTAL_AMOUNT}</span></strong></h6>
                    </div>
                </div>
            })
        }

        return (
            <div>
                {redirectVar}
                <BrowserRouter>
                    <div>
                        <Navbar />
                        <br />
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-9">
                                <h2>Dashboard</h2>

                            </div>
                            <div class="col-3" style={{ textAlign: "right" }}>
                                <button class="btn btn-primary btn-md" onClick={this.toggleSettleUp} style={{ backgroundColor: "#59cfa7", border: "none" }}><strong>Settle up</strong></button>
                            </div>
                        </div>
                        <div class="row" style={{ borderTop: "1px solid #a3a2a2"}}>
                            <div class="col-4" style={{ textAlign: "center", paddingTop: "10px" }}>
                                {/* borderLeft: "1px solid #a3a2a2" */}
                                {/* <span>total balance</span> */}
                                {/* <p>{prefix + Math.abs(this.state.totalBalance)}</p> */}


                                <div class="card text-dark bg-light" style={{ width: '26rem' }}>
                                    <div class="card-body">
                                        <h6 class="card-title"><strong><span style={{ color: "#8a8f94" }}>total balance</span></strong> <p>{prefix + Math.abs(this.state.totalBalance)}</p> </h6>
                                    </div>
                                </div>



                            </div>
                            <div class="col-4" style={{ textAlign: "center", paddingTop: "10px" }}>
                                {/* <span>you owe</span>
                                <p>{'$' + this.state.totalYouOwe}</p> */}

                                <div class="card text-dark bg-light" style={{ width: '26rem' }}>
                                    <div class="card-body">
                                        <h6 class="card-title"><strong><span style={{ color: "#8a8f94" }}>you owe</span></strong> <p>{'$' + this.state.totalYouOwe}</p> </h6>
                                    </div>
                                </div>


                            </div>
                            <div class="col-4" style={{ textAlign: "center", paddingTop: "10px" }}>
                                {/* <span>you are owed</span> */}
                                {/* <p>{'$' + this.state.totalYouAreOwed}</p> */}


                                <div class="card text-dark bg-light" style={{ width: '26rem' }}>
                                    <div class="card-body">
                                        <h6 class="card-title"><strong><span style={{ color: "#8a8f94" }}>you are owed</span></strong> <p>{'$' + this.state.totalYouAreOwed}</p> </h6>
                                    </div>
                                </div>


                            </div>
                            {/* <hr /> */}
                        </div>
                        <hr/>
                        <div class="row">
                            <div class="col-6">
                                <h6 style={{ color: "#8a8f94" }}><strong>YOU OWE</strong></h6>
                                {youOweList}
                            </div>
                            <div class="col-6">
                                <h6 style={{ color: "#8a8f94" }}><strong>YOU ARE OWED</strong></h6>
                                {youAreOwedList}
                            </div>
                        </div>
                        <Modal style={customStyles} isOpen={this.state.settleUpPopUp} ariaHideApp={false}>
                        <Settle data = {this.state} closePopUp={this.toggleSettleUp} />
                    </Modal>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
export default Dashboard;