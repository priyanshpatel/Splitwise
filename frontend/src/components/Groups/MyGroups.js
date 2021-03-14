import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PendingGroups from "./PendingGroups";
import AcceptedGroups from "./AcceptedGroups";

class MyGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            pendingInvites: [],
            acceptedInvites: [],
            myGroups: null,
            errorMessage: '',
            authFlag: null,
            MsgFlag: false,
            acceptFlag: null,
            rejectFlag: null,
            searchInput: null
        }
        this.acceptInvite = this.acceptInvite.bind(this);
        this.rejectInvite = this.rejectInvite.bind(this);
    }
    componentWillMount() {
        this.setState({
            userID: parseInt(cookie.load('userID'))
        })
    }
    componentDidMount() {
        console.log("============component did mount===============");
        console.log(cookie.load('userID'));
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/groups/mygroupspending/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        pendingInvites: response.data,
                        MsgFlag: false
                    });
                    console.log("===========inside pending 200==============");
                    console.log(response.data);
                } else if (response.status === 201) {
                    console.log("===========inside pending 201==============");
                    console.log(response.data);
                    this.setState({
                        MsgFlag: true,
                        errorMessage: 'No pending invites'
                    });
                } else {
                    console.log("============else pending==============");
                    console.log(response);
                    this.setState({
                        MsgFlag: true,
                        errorMessage: 'Error'
                    });
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

        console.log("============component did mount===============");
        console.log(cookie.load('userID'));
        axios.get('http://localhost:3001/groups/mygroups/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        //MsgFlag: false,
                        acceptedInvites: response.data
                    });
                    console.log("===========inside mygroups 200==============");
                    console.log(response.data);
                } else if (response.status === 201) {
                    console.log("===========inside mygroups 201==============");
                    console.log(response.data);
                    //this.setState({
                    //MsgFlag: true,
                    //errorMessage: 'No groups to display'
                    //});
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })
    }

    groupSearch = (e) => {
        this.setState({
            searchInput: e.target.value
        });
    };

    // Remove Invite
    rejectInvite = (group) => {
        const data = {
            userID: parseInt(cookie.load('userID')),
            groupID: group.GROUP_ID,
            flag: 'R'
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/groups/acceptrejectinvite', data)
            .then(response => {
                if (response.state === 200) {
                    console.log(response);
                    this.setState({
                        rejectFlag: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })

        const newPendingInvites = this.state.pendingInvites.filter((invite) => {
            return group.GROUP_ID != invite.GROUP_ID
        });
        const emptyInvitesFlag = newPendingInvites.length == 0 ? true : false;
        this.setState({
            pendingInvites: newPendingInvites,
            emptyInvitesFlag
        })
    }

    // Remove Invite and add to group
    acceptInvite = (group) => {
        const data = {
            userID: parseInt(cookie.load('userID')),
            groupID: group.GROUP_ID,
            flag: 'A'
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/groups/acceptrejectinvite', data)
            .then(response => {
                if (response.state === 200) {
                    console.log(response);
                    this.setState({
                        acceptFlag: response.data
                    })
                }
            }).catch(e => {
                console.log(e);
            })

        console.log("--------state change accept---------");
        console.log('accepted' + group.GROUP_NAME);
        console.log(this.state.pendingInvites);
        const newPendingInvites = this.state.pendingInvites.filter((invite) => {
            console.log("group: " + group.GROUP_ID + " invite.groupid: " + invite.GROUP_ID);
            // return group != invite.GROUP_ID
            // return invite.GROUP_ID != group.GROUP_ID
            return group.GROUP_ID != invite.GROUP_ID
        });
        console.log("NEWPENDINGINVITES");
        console.log(newPendingInvites);
        console.log("ACCEPTEDINVITES");
        console.log(this.state.acceptedInvites);
        const emptyInvitesFlag = newPendingInvites.length == 0 ? true : false;
        this.setState({
            pendingInvites: newPendingInvites,
            acceptedInvites: [group, ...this.state.acceptedInvites],
            emptyInvitesFlag,
            pendingInvites: newPendingInvites
        })
        console.log("NEWACCEPTEDINVITES");
        console.log(group);
        console.log(this.state.acceptedInvites);
    }

    render() {
        let redirectVar = null;
        if (!cookie.load('userID')) {
            redirectVar = <Redirect to="/" />
        };

        let pendingInvites = <div>No pending Invites</div>;
        let acceptedInvites = <div>No groups to show</div>;

        let searchedGroups = this.state.acceptedInvites.filter((group) => {
            if(group.GROUP_NAME!=null && this.state.searchInput != null){
                return group.GROUP_NAME.toLowerCase().includes(this.state.searchInput.toLowerCase());
            } else {
                return true
            }
        })

        if (this.state.pendingInvites != null) {
            pendingInvites = this.state.pendingInvites.map((invite) => {
                // return <div class="p-3 border bg-light">{invite}</div>;
                return <PendingGroups
                    key={invite.GROUP_ID}
                    data={invite}
                    acceptInvite={this.acceptInvite}
                    rejectInvite={this.rejectInvite}
                />
            })
        }
        if (this.state.acceptedInvites != null) {
            acceptedInvites = this.state.acceptedInvites.map((invite) => {
                return <AcceptedGroups
                    key={invite.GROUP_ID}
                    data={invite}
                    leaveGroup={this.leaveGroup}
                />
            })
        }

        if (this.state.searchInput != null){
            acceptedInvites = searchedGroups.map((invite) => {
                return <AcceptedGroups
                    key={invite.GROUP_ID}
                    data={invite}
                    leaveGroup={this.leaveGroup}
                />
            })
        }
        return (
            <div>
                {redirectVar}
                <BrowserRouter>
                    <div>
                        <Navbar />
                    </div>
                    <br />
                    <div class="container">
                        <h3><strong>My groups</strong></h3>
                        <hr/>
                        <div class="row">
                            <div class="col-3">
                                <h4 style={{ color: "#8a8f94" }}><strong>Pending Invites</strong></h4>
                            </div>
                            <div class="col-3">

                            </div>
                            <div class="col-5">
                                <h4 style={{ color: "#8a8f94" }}><strong>Groups</strong></h4>
                            </div>
                            <div class="col-1">

                            </div>
                        </div>

                        <div class="overflow-hidden">
                            <div class="row gy-5">
                                <div class="col-6">
                                    <p></p>
                                    {pendingInvites}
                                    {this.state.MsgFlag ? <div class="alert alert-success" role="alert">{this.state.errorMessage}</div> : null}
                                    {/* <div class="p-3 border bg-light">Custom column padding 1</div>
                                    <div class="p-3 border bg-light">Custom column padding 11</div> */}
                                </div>
                                <div class="col-6">
                                    {/* <input type="text" name="searchInput" onChange={this.groupSearch} placeholder="Group Search" /> */}
                                    <p></p>
                                    <div class="input-group rounded">
                                        <input type="search" name="searchInput" onChange={this.groupSearch} class="form-control rounded" placeholder="Search" aria-label="Search"
                                            aria-describedby="search-addon" style={{ fontWeight: "bold" }}/>
                                        <span class="input-group-text border-0" id="search-addon">
                                            <i class="fa fa-search"></i>
                                        </span>
                                    </div>
                                    <br />
                                    {acceptedInvites}
                                    {/* <div class="p-3 border bg-light">Custom column padding 111</div>
                                    <div class="p-3 border bg-light">Custom column padding 1111</div> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
export default MyGroups;