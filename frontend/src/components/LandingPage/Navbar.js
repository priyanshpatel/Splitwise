import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../../App.css';
import splitwise_home from '../../images/splitwise_home.png';
import splitwise_logo from '../../images/splitwise_logo.png';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout = () => {
        cookie.remove('userID', { path: '/' })
        cookie.remove('userName', { path: '/' })
        cookie.remove('phoneNumber', { path: '/' })
        cookie.remove('timezone', { path: '/' })
        cookie.remove('currency', { path: '/' })
        cookie.remove('language', { path: '/' })
        cookie.remove('profilePicture', { path: '/' })
    }

    render() {
        // let navLogin = null;
        // if (cookie.load('userID')) {
        //     console.log("Cookie can be read");
        //     navLogin = (
        //         <ul class="nav navbar-nav navbar-right">
        //             <a class="btn btn-primary" type="button" href="/" onClick={this.handleLogout} style={{ backgroundColor: "#59cfa7", border: "none" }}>Logout</a>
        //         </ul>
        //     );
        // } else {
        //     console.log("Cookie cannot be read");
        //     navLogin = (
        //         <nav class="navbar navbar-light bg-light">
        //             <a class="nav-link landing-link" href="/login" style={{ color: "#59cfa7" }}><strong>Login</strong></a>
        //             <a class="btn btn-primary" type="button" href="/signup" style={{ backgroundColor: "#59cfa7", border: "none" }}>Sign up</a>
        //         </nav>
        //     )
        // }

        // return (
        //     <div>
        //         <nav class="navbar navbar-expand-lg navbar-light bg-light">
        //             <div class="container">
        //                 <a class="navbar-brand" href="#">
        //                     {/* <img src="https://lh3.googleusercontent.com/proxy/u5Jk4tgNiM-h3mYXjxrqeDClx4Qp5tyiMvrAdPrqaoaBt_obioNdG1FX1wL6K8yKsUyYpPEbp-zfcxeynL4K-RQiQ5hW-QBJWMURbAsn_NkqaFuOH0I" width="40" height="40" class="d-inline-block align-top" alt=""/> */}
        //                     <img src={splitwise_logo} width="40" height="40" class="d-inline-block align-top" alt="" href="/" />
        //                     <span style={{ paddingLeft: "10px" }}><strong>Splitwise</strong></span>
        //                 </a>
        //                 {navLogin}
        //             </div>
        //         </nav>
        //     </div>
        // )

        if (cookie.load('userID')) {
            return (
                <div>
                    <nav class="navbar navbar-expand-lg navbar-light" style={{
            background: "#D32323",
            background: "#59cfa7",
            width: "100%",
            height: "50px",
          }}>
                        <div class="container">
                            <a class="navbar-brand" href="#">
                                {/* <img src="https://lh3.googleusercontent.com/proxy/u5Jk4tgNiM-h3mYXjxrqeDClx4Qp5tyiMvrAdPrqaoaBt_obioNdG1FX1wL6K8yKsUyYpPEbp-zfcxeynL4K-RQiQ5hW-QBJWMURbAsn_NkqaFuOH0I" width="40" height="40" class="d-inline-block align-top" alt=""/> */}
                                <img src={splitwise_logo} width="40" height="40" class="d-inline-block align-top" alt="" href="/" />
                                <span style={{ paddingLeft: "10px", color: "white" }}><strong>Splitwise</strong></span>
                            </a>
                            <ul class="nav navbar-nav navbar-right">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: "white" }}>
                                        <em>{cookie.load('userName')}</em>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="/">Dashboard</a></li>
                                        <li><a class="dropdown-item" href="/profile">Your account</a></li>
                                        <li><a class="dropdown-item" href="/mygroups">My groups</a></li>
                                        <li><a class="dropdown-item" href="/creategroup">Create a group</a></li>
                                        <li><hr class="dropdown-divider"/></li>
                                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                                    </li>

                                    <a class="btn btn-primary" type="button" href="/" onClick={this.handleLogout} style={{ backgroundColor: "#59cfa7", border: "none" }}>Logout</a>
                            </ul>
                        </div>
                    </nav>
                </div>
            )
        } else {
            return (
                    <div>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <div class="container">
                                <a class="navbar-brand" href="#">
                                    {/* <img src="https://lh3.googleusercontent.com/proxy/u5Jk4tgNiM-h3mYXjxrqeDClx4Qp5tyiMvrAdPrqaoaBt_obioNdG1FX1wL6K8yKsUyYpPEbp-zfcxeynL4K-RQiQ5hW-QBJWMURbAsn_NkqaFuOH0I" width="40" height="40" class="d-inline-block align-top" alt=""/> */}
                                    <img src={splitwise_logo} width="40" height="40" class="d-inline-block align-top" alt="" href="/" />
                                    <span style={{ paddingLeft: "10px" }}><strong>Splitwise</strong></span>
                                </a>
                                <nav class="navbar navbar-light bg-light">
                                    <a class="nav-link landing-link" href="/login" style={{ color: "#59cfa7" }}><strong>Login</strong></a>
                                    <a class="btn btn-primary" type="button" href="/signup" style={{ backgroundColor: "#59cfa7", border: "none" }}>Sign up</a>
                                </nav>
                            </div>
                        </nav>
                    </div>
            )
        }
    }
}

export default Navbar;