import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import Moment from 'react-moment';

class RecentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            groupSort: null,
            sort: null,
            activityData: [],
            groups: []
        }
    }
    componentWillMount() {
        this.setState({
            userID: parseInt(cookie.load('userID')),
            groupSort: 0,
            sort: 2
        })
    }
    componentDidMount() {
        axios.defaults.withCredentials = true;

        axios.get('http://localhost:3001/groups/mygroups/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        groups: response.data
                    });
                } else if (response.status === 201) {
                    console.log(response.data);
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

        axios.get('http://localhost:3001/activities/recent_activity/' + cookie.load('userID') + '/' + this.state.groupSort + '/' + this.state.sort)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        activityData: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })
    }

    handleSort = (e) => {
        e.preventDefault()
        console.log(e.target.value);
        this.setState({
            sort: e.target.value
        })
        axios.get('http://localhost:3001/activities/recent_activity/' + cookie.load('userID') + '/' + this.state.groupSort + '/' + this.state.sort)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        activityData: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })
    }

    handleGroupSort = (e) => {
        e.preventDefault()
        console.log(e.target.value);
        this.setState({
            groupSort: e.target.value
        })
        axios.get('http://localhost:3001/activities/recent_activity/' + cookie.load('userID') + '/' + e.target.value + '/' + this.state.sort)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        activityData: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })
    }

    render() {
        let dropDownGroups = this.state.groups.length > 0
            && this.state.groups.map((item, i) => {
                return (
                    <option key={i} value={item.GROUP_ID}>{item.GROUP_NAME}</option>
                )
            }, this);

        let activityData = <div>You don't owe anything</div>
        if (this.state.activityData != null) {
            activityData = this.state.activityData.map((activity) => {
                return <div class="card text-dark bg-light" style={{ width: '81rem' }}>
                    <div class="card-body">
                        {/* <h6 class="card-title"> <strong>{youOwe.USER_NAME} <span style={{ color: "#ed752f" }}>${youOwe.TOTAL_AMOUNT}</span></strong></h6> */}
                        <h6 class="card-title">{activity.MESSAGE_1}</h6>
                        <p class="card-text">{activity.MESSAGE_2}</p>
                        <p class="card-text" style={{ color: "#8a8f94" }}><strong><Moment format="MMM DD">{activity.CREATED_AT}</Moment></strong></p>
                    </div>
                </div>
            })
        }


        let redirectVar = null;
        if (!cookie.load('userID')) {
            redirectVar = <Redirect to="/" />
        }

        return (
            <div>
                {redirectVar}
                <div>
                    <Navbar />
                    <br />
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-6">
                            <h2>Recent Activity</h2>
                        </div>
                        <div class="col-3" style={{ textAlign: "right" }}>
                            <div class="input-group mb-3">
                                <select class="form-select" style={{ fontWeight: "bold" }} aria-label="user select" onChange={this.handleSort}>
                                    <option selected>Sort</option>
                                    <option value="1">Newest first</option>
                                    <option value="2">Oldest first</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3" style={{ textAlign: "right" }}>
                            <div class="input-group mb-3">
                                <select class="form-select" style={{ fontWeight: "bold" }} aria-label="user select" onChange={this.handleGroupSort}>
                                    <option selected>Filter by group</option>
                                    {dropDownGroups}
                                </select>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div class="row">
                        <div class="col-12">
                            {activityData}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecentActivity;