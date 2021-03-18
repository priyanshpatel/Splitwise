import React, { Component } from 'react';
import { BrowserRouter, Link, NavLink } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import config from "../../config.json";

class AddExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GROUP_NAME: this.props.data.GROUP_NAME,
            GROUP_ID: this.props.data.GROUP_ID,
            userID: this.props.data.userID,
            groupExpenses: this.props.data.groupExpenses,
            groupBalances: this.props.data.groupBalances,
            addExpensePopUp: this.props.data.addExpensePopUp,
            MsgFlag: false,
            Msg: "",
            description: "",
            amount: null
        }
    }

    amountValidate = (e) => {
        e.preventDefault()
        if (e.target.value < 0) {
            this.setState({
                MsgFlag: true,
                Msg: "Please enter a valid amount",
                amount: null
            })
        } else {
            this.setState({
                MsgFlag: false,
                Msg: "",
                amount: e.target.value
            })
        }
    }

    descriptionHandler = (e) => {
        e.preventDefault()
        this.setState({
            description: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.state.MsgFlag) {
            // e.preventDefault();
            const data = {
                description: this.state.description,
                amount: this.state.amount,
                groupID: this.state.GROUP_ID,
                userID: this.state.userID,
                currency: '$'
            }
            console.log(data);

            axios.defaults.withCredentials = true;
            axios.post(config.API_URL+'/expenses/add', data)
                .then(response => {
                    console.log("=========Inside frontend===========");
                    console.log("Status Code: ", response.status);
                    console.log(response.data);
                    if (response.status === 200) {
                        window.location.reload()
                    } else {
                        console.log(response.data);
                        this.setState({
                            MsgFlag: true,
                            Msg: "Add expense failed"
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
        }

    }
    render() {
        return (
            <div class="container">
                <div class="row">
                    <div class="col-11">
                        <h6><strong>Add an expense</strong></h6>
                        <hr></hr>
                    </div>
                    <div class="col-1" style={{ textAlign: "right" }}>
                        {/* <i class="fa fa-times button"></i> */}
                        <button class="btn btn-primary" style={{ backgroundColor: "#ed752f", border: "none" }} onClick={this.props.closePopUp}><i class="fa fa-times button"></i></button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <h6>With <strong>you</strong> and all of <strong>{this.state.GROUP_NAME}</strong></h6>
                        <hr></hr>
                    </div>
                </div>
                <div class="row">
                    <form method="post">
                        <div class="input-group mb-3">
                            <input type="text" name="description" class="form-control" id="description" placeholder="Enter a description" style={{ fontWeight: "bold" }} onChange={this.descriptionHandler} required></input>
                        </div>
                        {/* <div class="mb-3" style={{float:"right"}}>
                            <span class="left-inner-addon"><strong>$</strong></span>
                            <input type="number" name="amount" step=".01" placeholder="0.00" min="0"></input>
                        </div> */}
                        {/* <div class="mb-3">
                        <button class="btn btn-primary" style={{ backgroundColor: "#ed752f", border: "none" }}><strong>Save</strong></button>
                        </div> */}
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input type="number" class="form-control" name="amount" step=".01" placeholder="0.00" min="0.01" style={{ fontWeight: "bold" }} onChange={this.amountValidate} required />
                        </div>
                        <button type="submit" class="btn btn-primary" style={{ backgroundColor: "#59cfa7", border: "none" }} onClick={this.handleSubmit}><strong>Submit</strong></button>
                        {/* {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.Msg}</div> : null} */}
                    </form>
                </div><br />
                {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.Msg}</div> : null}
            </div>
        )
    }
}
export default AddExpense;

