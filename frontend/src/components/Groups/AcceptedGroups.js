import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";

class AcceptedGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // groupID: this.props.data.GROUP_ID,
            // groupName: this.props.data.GROUP_NAME,
            // inviteFlag: this.props.data.INVITE_FLAG

            GROUP_NAME: this.props.data.GROUP_NAME,
            GROUP_ID: this.props.data.GROUP_ID,
            INVITE_FLAG: this.props.data.INVITE_FLAG
        }
    }

    componentDidMount() {
        console.log("----------inside accepted component-------------");
        console.log(this.state.GROUP_ID);
        console.log(this.state.GROUP_NAME);
        console.log(this.state.INVITE_FLAG);
    }

    render() {
        return (
            <div class="card" style={{width: '38rem'}}>
                <div class="card-body">
                    <h5 class="card-title">{this.state.GROUP_NAME}</h5>
                    <a href="#" class="btn btn-outline-primary">Details</a>&nbsp;
                    <a href="" class="btn btn-outline-danger">Leave</a>
                    {/* <a href="#" class="btn btn-outline-primary">Details</a>&nbsp;
                    <a href="#" class="btn btn-outline-success">Accept</a>&nbsp;
                    <a href="#" class="btn btn-outline-secondary">Reject</a> */}
                </div>
            </div>
        )
    }
}
export default AcceptedGroups;