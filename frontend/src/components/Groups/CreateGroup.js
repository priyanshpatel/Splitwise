import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";

class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            groupMembers: [],
            groupName: '',
            groupPicture: '',
            errorMessage: '',
            authFlag: null,
            MsgFlag: false
        }
    }
    componentWillMount() {
        this.setState({
            userID: parseInt(cookie.load('userID'))
        })
    }

    searchOptions = (inp, callback) => {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/groups/search/users?keyword=' + inp)
            .then(response => {
                if (response.status === 200) {
                    const searchedUsers = response.data.users.map((user) => {
                        return {
                            label: user.USER_NAME + "(" + user.USER_EMAIL + ")",
                            value: user.USER_ID,
                        };
                    });
                    console.log("==============INSIDE SEARCH==============");
                    console.log(searchedUsers);
                    callback(searchedUsers)
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

    };

    groupNameChangeHandler = (e) => {
        this.setState({
            groupName: e.target.value
        })
    }

    groupSave = (e) => {
        e.preventDefault();
        if (this.state.groupMembers == null) {
            this.setState({
                MsgFlag: true,
                errorMessage: "Please select group members"
            })
        }
        else {
            const data = {
                userID: parseInt(cookie.load('userID')),
                groupName: this.state.groupName,
                groupMembers: this.state.groupMembers,
                groupPicture: this.state.groupPicture
            };
            console.log("============Group Save==============");
            console.log(data);

            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/groups/create', data)
                .then(response => {
                    console.log(response);
                    if (response.state === 200) {
                        this.setState({
                            authFlag: true,
                            MsgFlag: false
                        })
                        console.log("Group successfully created");
                        //window.location.assign('/profile/' + cookie.load('userID'))
                        //this.props.history.push("/dashboard")
                        window.location.reload()
                    } else if (response.status === 201) {
                        this.setState({
                            authFlag: true,
                            MsgFlag: true,
                            errorMessage: "Group name already exists."
                        })
                        console.log("Group Name already exists");
                    }
                }).catch(e => {
                    console.log(e);
                    this.setState({
                        authFlag: false,
                        MsgFlag: true,
                        errorMessage: e
                    })
                })
        }
    }

    usersChangeHandler = (e) => {
        console.log("usersChangeHandler");
        this.setState({
            groupMembers: e
        })
    }

    render() {
        let redirectVar = null;
        if (!cookie.load('userID')) {
            redirectVar = <Redirect to="/" />
        }
        return (
            <div>
                {redirectVar}
                <BrowserRouter>
                    <div>
                        <Navbar />
                    </div>
                    <div class="container">
                        <div class="row div-pad">
                            <div class="col-3"></div>
                            <div class="col-3">
                                <input
                                    accept="image/x-png,image/gif,image/jpeg"
                                    type="file"
                                    name="profileImage"
                                />
                            </div>
                            <div class="col-3">
                                <span style={{ color: "#8a8f94" }}><strong>START A NEW GROUP</strong></span>
                                <form onSubmit={this.groupSave} method="post">
                                    <label for="groupName"><strong>My group shall be called...</strong></label>
                                    <input class="form-input" style={{ fontWeight: "bold" }} onChange={this.groupNameChangeHandler} type="text" id="groupName" class="form-control" name="groupName" required></input>
                                    <br />
                                    <label><strong>GROUP MEMBERS</strong></label>
                                    <AsyncSelect
                                        isMulti
                                        value={this.state.users}
                                        onChange={this.usersChangeHandler}
                                        placeholder={"Search by name or email"}
                                        loadOptions={this.searchOptions}
                                    />
                                    <br />
                                    <button class="btn btn-primary" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }}>Save</button>
                                    <br /><br />
                                    {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.errorMessage}</div> : null}
                                </form>
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
export default CreateGroup;