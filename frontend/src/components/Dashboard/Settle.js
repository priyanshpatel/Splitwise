import React, { Component } from 'react';
import { BrowserRouter, Link, NavLink } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'

class Settle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: this.props.data.userID,
            youOweList: this.props.data.youOweList,
            MsgFlag: false,
            Msg: "",
            settleUserID: null
        }
    }

    dropDownHandler = (e) => {
        e.preventDefault()
        this.setState({
            settleUserID: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.state.MsgFlag) {
            const data = {
                userID1: this.state.userID,
                userID2: this.state.settleUserID
            }
            console.log(data);


            axios.post('http://localhost:3001/activities/settleup', data)
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
                            Msg: "Settle up failed"
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })

            // window.location.reload()
        }
    }

    render() {
        
        // if (this.state.youOweList.length ==0){
        //     this.setState({
        //         MsgFlag: true,
        //         Msg: "You are all settled up"
        //     })
        // }

        let dropDownFill = this.state.youOweList.length > 0
		&& this.state.youOweList.map((item, i) => {
		return (
			<option key={i} value={item.USER_ID}>{item.USER_NAME} ({item.USER_EMAIL})</option>
		)
	}, this);

        return (
            <div class="container">
                <div class="row">
                    <div class="col-11">
                        <h6><strong>Settle up</strong></h6>
                        <hr></hr>
                    </div>
                    <div class="col-1" style={{ textAlign: "right" }}>
                        <button class="btn btn-primary" style={{ backgroundColor: "#ed752f", border: "none" }} onClick={this.props.closePopUp}><i class="fa fa-times button"></i></button>
                    </div>
                </div>
                <div class="row">
                    <form method="post">
                        <div class="input-group mb-3">
                            <select class="form-select" aria-label="user select" onChange={this.dropDownHandler}>
                                <option selected>Select user</option>
                                {dropDownFill}
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary" style={{ backgroundColor: "#59cfa7", border: "none" }} onClick={this.handleSubmit}><strong>Settle up</strong></button>
                    </form>
                </div><br/>
                {this.state.MsgFlag ? <div class="alert alert-success" role="alert">{this.state.Msg}</div> : null}
            </div>
        )
    }
}
export default Settle;