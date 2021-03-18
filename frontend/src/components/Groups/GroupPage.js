import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';
import Moment from 'react-moment'
import Modal from 'react-modal';
import AddExpense from "./AddExpense"
import config from "../../config.json";
import EditGroup from "./EditGroup"


const customStyles = {
    content: {
        top: "40%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        height: "400px",
        width: "500px",
        transform: "translate(-50%, -50%)",
    },
};

const customStyles_2 = {
    content: {
        top: "40%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        height: "500px",
        width: "500px",
        transform: "translate(-50%, -50%)",
    },
};

class GroupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GROUP_NAME: "",
            GROUP_ID: null,
            userID: null,
            groupExpenses: [],
            groupBalances: [],
            addExpensePopUp: false,
            editGroupPopUp: false,
            GROUP_PICTURE: "",
            image: null
        }
    }

    componentDidMount() {
        const groupID = this.props.match.params.groupid
        this.setState({
            GROUP_ID: this.props.match.params.groupid,
            userID: parseInt(cookie.load('userID'))
        })

        axios.defaults.withCredentials = true;
        axios.get(config.API_URL + '/groups/groupdetails/' + this.props.match.params.groupid)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        GROUP_NAME: response.data[0].GROUP_NAME,
                        GROUP_PICTURE: response.data[0].GROUP_PICTURE,
                        image: config.API_URL + "/" + response.data[0].GROUP_PICTURE
                    });
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

        axios.get(config.API_URL + '/groups/groupexpenses/' + this.props.match.params.groupid)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        groupExpenses: response.data
                    });
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

        axios.get(config.API_URL + '/groups/groupbalances/' + this.props.match.params.groupid)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        groupBalances: response.data
                    });
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })
    }

    toggleAddExpense = () => {
        this.setState({
            addExpensePopUp: !this.state.addExpensePopUp
        })
    }

    toggleEditGroup = () => {
        this.setState({
            editGroupPopUp: !this.state.editGroupPopUp
        })
    }

    render() {
        // const moment = require('moment')
        let redirectVar = null;
        if (!cookie.load('userID')) {
            redirectVar = <Redirect to="/" />
        };

        let groupExpenses = <div>No expenses</div>;
        if (this.state.groupExpenses != null) {
            groupExpenses = this.state.groupExpenses.map((expense) => {
                return <div class="card text-dark bg-light" style={{ width: '38rem' }}>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-7">
                                <div class="row">
                                    <div class="col-3">
                                        <h6 class="card-title" style={{ paddingLeft: "15px", paddingTop: "15px", color: "#8a8f94" }}><strong><Moment format="MMM DD">{expense.CREATED_AT}</Moment></strong></h6>
                                    </div>
                                    <div class="col-9">
                                        {expense.SETTLE_FLAG == 'Y' && expense.PAID_BY_USER_ID == this.state.userID ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>You and {expense.SETTLED_WITH_USER_NAME} settled up</strong></h6> : null}
                                        {expense.SETTLE_FLAG == 'Y' && expense.SETTLED_WITH_USER_ID == this.state.userID ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>You and {expense.USER_NAME} settled up</strong></h6> : null}
                                        {expense.SETTLE_FLAG == 'Y' && expense.SETTLED_WITH_USER_ID != this.state.userID && expense.PAID_BY_USER_ID != this.state.userID ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>{expense.USER_NAME} and {expense.SETTLED_WITH_USER_NAME} settled up</strong></h6> : null}
                                        {expense.SETTLE_FLAG == 'N' ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>{expense.DESCRIPTION}</strong></h6> : null}
                                    </div>
                                </div>
                            </div>
                            <div class="col-5">
                                <div class="row">
                                    {expense.SETTLE_FLAG == 'N' && expense.PAID_BY_USER_ID != this.state.userID ? <h6 class="card-title" style={{ textAlign: "right", color: "#8a8f94" }}><strong>{expense.USER_NAME + " Paid"}</strong></h6> : null}
                                    {expense.SETTLE_FLAG == 'N' && expense.PAID_BY_USER_ID == this.state.userID ? <h6 class="card-title" style={{ textAlign: "right", color: "#8a8f94" }}><strong>{"You Paid"}</strong></h6> : null}
                                </div>
                                <div class="row">
                                    {expense.SETTLE_FLAG == 'N' ? <h6 class="card-title" style={{ textAlign: "right" }}><strong>{expense.CURRENCY + expense.AMOUNT}</strong></h6> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            })
        }

        let groupBalances = <div>No group balances</div>
        if (this.state.groupBalances != null) {
            groupBalances = this.state.groupBalances.map((expense) => {
                return <div class="card text-dark" style={{ width: '15rem' }}>
                    <div class="card-body">
                        {expense.USER_ID != this.state.userID ? <h6 class="card-title"><strong>{expense.USER_NAME}</strong></h6> : <h6 class="card-title"><strong>{"Your balance:"}</strong></h6>}
                        <h6 class="card-title"><strong>{expense.CURRENCY}</strong></h6>
                        {expense.OWE_AMOUNT < 0 ? <h6 class="card-title" style={{ color: "#ed752f" }}><strong>{"Owes $" + Math.abs(expense.OWE_AMOUNT)}</strong></h6> : null}
                        {expense.OWE_AMOUNT > 0 ? <h6 class="card-title" style={{ color: "#59cfa7" }}><strong>{"Gets back $" + expense.OWE_AMOUNT}</strong></h6> : null}
                        {expense.OWE_AMOUNT == 0 ? <h6 class="card-title" style={{ color: "#59cfa7" }}><strong>{"Balances settled up"}</strong></h6> : null}
                    </div>
                </div>
            })
        }

        return (
            <div>
                {redirectVar}
                <div>
                    <Navbar />
                </div>
                <br />
                <div class="container">
                    <div class="row">
                        <div class="col-2">

                        </div>
                        <div class="col-4">
                            <h3><strong>{this.state.GROUP_NAME}  <button class="btn btn-primary" style={{ backgroundColor: "#59cfa7", border: "none" }} onClick={this.toggleEditGroup}><i class="fa fa-edit"></i></button></strong></h3><br />
                        </div>
                        <div class="col-4">
                            <button class="btn btn-primary" style={{ backgroundColor: "#ed752f", border: "none" }} onClick={this.toggleAddExpense}><strong>Add an expense</strong></button>
                        </div>
                        <div class="col-2">

                        </div>
                        <hr></hr>
                    </div>
                    <div class="row">
                        <div class="col-2">

                        </div>
                        <div class="col-4">
                            {groupExpenses}
                            <br></br>
                        </div>
                        <div class="col-3">

                        </div>
                        <div class="col-3">
                            <h6 style={{ color: "#8a8f94" }}><strong>GROUP BALANCES</strong></h6>
                            {groupBalances}
                        </div>
                        <hr></hr>
                    </div>
                    <Modal style={customStyles} isOpen={this.state.addExpensePopUp} ariaHideApp={false}>
                        <AddExpense data={this.state} closePopUp={this.toggleAddExpense} />
                    </Modal>
                    <Modal style={customStyles_2} isOpen={this.state.editGroupPopUp} ariaHideApp={false}>
                        <EditGroup data={this.state} closePopUp={this.toggleEditGroup} />
                    </Modal>
                </div>
            </div>
        )
    }
}
export default GroupPage;