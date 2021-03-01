import React,{Component} from 'react';
import {BrowserRouter, Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbar from './Navbar';
import home_background from '../../images/home_background.png';
import landing_plane from '../../images/landing_plane.png'

class LandingPage extends Component {
    constructor(props){
        super(props);
        // this.loginClick = this.loginClick.bind(this);
        // this.submitClick = this.submitClick.bind(this);
    }

    render(){
        return(
            <BrowserRouter>
                <div>
                    <Navbar/>
                </div>
                <div class="home-background h-100">
                    <div class="container">
                        <div class="row">
                            <div class="col-5 div-pad">
                                <h1><strong>Less stress when<br/>sharing expenses<br/><div class="splitwise-color">on trips.</div></strong></h1>
                                <i class="fa fa-plane icon-style splitwise-color"></i>
                                <i class="fa fa-home icon-style"></i>
                                <i class="fa fa-heart icon-style"></i>
                                <i class="fa fa-asterisk icon-style"></i>
                                <p><strong>Keep track of your shared expenses and<br/>balances with housemates, trips, groups,<br/>friends, and family.</strong></p>
                                <br/>
                                <a class="btn btn-primary btn-lg" href="/signup" type="button" style={{ backgroundColor: "#59cfa7", border: "none" }}>Sign up</a>
                            </div>
                            <div class="col-7">
                            {/* <i class="fa fa-plane icon-style splitwise-color " style={{ fontSize: "100px"}}></i> */}
                            <div><img class="landing-plane" src={landing_plane} style={{ paddingTop: "20px"}}></img></div>
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
            
        )
    }
}

export default LandingPage;