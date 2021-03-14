import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";

class PendingGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // group: {
            //     groupID: this.props.data.GROUP_ID,
            //     groupName: this.props.data.GROUP_NAME,
            //     inviteFlag: this.props.data.INVITE_FLAG
            // }

            // groupID: this.props.data.GROUP_ID,
            // groupName: this.props.data.GROUP_NAME,
            // inviteFlag: this.props.data.INVITE_FLAG

            GROUP_NAME: this.props.data.GROUP_NAME,
            GROUP_ID: this.props.data.GROUP_ID,
            INVITE_FLAG: this.props.data.INVITE_FLAG
        }
    }

    componentDidMount() {
        console.log("----------inside pending component-------------");
        console.log(this.state.groupID);
        console.log(this.state.groupName);
        console.log(this.state.inviteFlag);
        // console.log(this.state.group);
    }

    render() {
        return (
            <div class="card" style={{ width: '38rem' }}>
                <div class="card-body">
                    <h5 class="card-title">{this.state.GROUP_NAME}</h5>
                    <a href="#" class="btn btn-outline-primary">Details</a>&nbsp;
                    <a href="" onClick={this.props.acceptInvite.bind(this, this.state)} class="btn btn-outline-success">Accept</a>&nbsp;
                    <a href="" onClick={this.props.rejectInvite.bind(this, this.state)} class="btn btn-outline-secondary">Reject</a>
                </div>
            </div>
        )
    }
}
export default PendingGroups;