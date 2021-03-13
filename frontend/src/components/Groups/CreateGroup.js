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
            users: []
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

        // try {
        //     const response = await axios.get(
        //         config.BACKEND_URL + "/search/users?keyword=" + inp,
        //         { headers: utils.getJwtHeader(cookie.load("jwtToken")) }
        //     );
        //     const searchedUsers = response.data.users.map((user) => {
        //         return {
        //             label: user.USER_NAME + "(" + user.USER_EMAIL + ")",
        //             value: user.USER_ID,
        //         };
        //     });
        //     console.log(searchedUsers);
        //     callback(searchedUsers);
        // } catch (error) {
        //     if (error.response.status === 401)
        //         this.setState({
        //             tokenState: false,
        //         });
        //     else {
        //         console.log("NOT INSIDE LOADS 401");
        //         console.log(error.response);
        //     }
        // }
    };

    getUsers = (e) => {
        console.log("GET USERS");
        console.log(e);
        this.setState({
            users: e
        })
    }

    render() {
        return (
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
                            <form onSubmit={this.submitLogin} method="post">
                                <label for="groupName"><strong>My group shall be called...</strong></label>
                                <input class="form-input" style={{ fontWeight: "bold" }} onChange={this.emailChangeHandler} type="text" id="groupName" class="form-control" name="groupName" required></input>
                                <br />
                                <AsyncSelect
                                    isMulti
                                    value={this.state.users}
                                    onChange={this.getUsers}
                                    placeholder={"Search by name or email"}
                                    loadOptions={this.searchOptions}
                                />
                                <br />
                                <button class="btn btn-primary" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
export default CreateGroup;