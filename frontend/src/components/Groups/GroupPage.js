import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';

class GroupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GROUP_NAME: "",
            GROUP_ID: null,
            userID: null
        }
    }

    componentDidMount() {
        console.log("----------inside grouppage component-------------");
        const groupID = this.props.match.params.groupid
        console.log("========handle=========");
        console.log(groupID);
        this.setState({
            GROUP_ID: this.props.match.params.groupid,
            userID: parseInt(cookie.load('userID'))
        })

        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/groups/groupdetails/' + this.props.match.params.groupid)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        GROUP_NAME: response.data[0].GROUP_NAME
                    });
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })
    }
    render() {
        let redirectVar = null;
        if (!cookie.load('userID')) {
            redirectVar = <Redirect to="/" />
        };
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
                            <h3><strong>{this.state.GROUP_NAME}</strong></h3><br/>
                        </div>
                        <div class="col-3">
                        <button class="btn btn-primary" style={{ backgroundColor: "#ed752f", border: "none" }}><strong>Add an expense</strong></button>
                        </div>
                        <div class="col-3">

                        </div>
                        <hr></hr>
                    </div>
                </div>
            </div>
        )
    }
}
export default GroupPage;