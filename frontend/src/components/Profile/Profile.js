import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import config from "../../config.json";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            userName: null,
            userEmail: null,
            phoneNumber: null,
            timezone: null,
            currency: null,
            language: null,
            profilePicture: null,
            errorMessage: "",
            authFlag: null,
            imageUpdateFlag: false,
            image: null,
            updateFlag: false,
            Msg: ""
        };
        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
    }
    componentDidMount() {
        this.setState({
            userID: parseInt(cookie.load('userID'))
        })
        console.log("============component did mount===============");
        console.log(cookie.load('userID'));
        axios.defaults.withCredentials = true;
        axios.get(config.API_URL + '/profile/' + cookie.load('userID'))
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        userName: response.data.userName,
                        userEmail: response.data.userEmail,
                        phoneNumber: response.data.phoneNumber,
                        timezone: response.data.timezone,
                        currency: response.data.currency,
                        language: response.data.language,
                        profilePicture: response.data.profilePicture,
                        image: config.API_URL + "/" + response.data.profilePicture
                    });
                    console.log("===========inside 200==============");
                    console.log(response.data);
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })
    }

    ChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleImageChange = (e) => {
        this.setState({
            imageUpdateFlag: true,
            image: URL.createObjectURL(e.target.files[0]),
            profilePicture: e.target.files[0],
        })
    }

    submitUpdate = (e) => {
        console.log("===============submit update==============");
        console.log(this.state.userName);
        console.log(this.state.userEmail);
        console.log(this.state.phoneNumber);
        console.log(this.state.timezone);
        console.log(this.state.currency);
        console.log(this.state.language);
        e.preventDefault();

        let formData = new FormData();
        if (this.state.imageUpdateFlag) {
            formData.append(
                "profilePicture",
                this.state.profilePicture,
                this.state.profilePicture.name
            );
        }
        formData.append("userID", parseInt(cookie.load('userID')));
        formData.append("userName", this.state.userName);
        formData.append("userEmail", this.state.userEmail);
        formData.append("phoneNumber", this.state.phoneNumber);
        formData.append("timezone", this.state.timezone);
        formData.append("currency", this.state.currency);
        formData.append("language", this.state.language);

        // const data = {
        //     userID: parseInt(cookie.load('userID')),
        //     userName: this.state.userName,
        //     userEmail: this.state.userEmail,
        //     phoneNumber: this.state.phoneNumber,
        //     timezone: this.state.timezone,
        //     currency: this.state.currency,
        //     language: this.state.language,
        //     profilePicture: this.state.profilePicture
        // };
        console.log("============update profile==============");
        // console.log(data);

        axios.defaults.withCredentials = true;
        axios.post(config.API_URL + '/profile/update', formData, {
            headers: Object.assign(
                { "content-type": "multipart/form-data" }
            )
        })
            .then(response => {
                this.setState({
                    authFlag: true,
                    updateFlag: true,
                    Msg: "Profile successfully updated"
                })
                if (response.state === 200) {
                    this.setState({
                        authFlag: true,
                        updateFlag: true,
                        Msg: "Profile successfully updated"
                    })
                    cookie.save('userEmail', this.state.userEmail, { path: '/' })
                    cookie.save('userName', this.state.userName, { path: '/' })
                    cookie.save('phoneNumber', this.state.phoneNumber, { path: '/' })
                    cookie.save('timezone', this.state.timezone, { path: '/' })
                    cookie.save('currency', this.state.currency, { path: '/' })
                    cookie.save('language', this.state.language, { path: '/' })
                    cookie.save('profilePicture', this.state.profilePicture, { path: '/' })

                    //window.location.assign('/profile/' + cookie.load('userID'))
                    //this.props.history.push("/dashboard")
                    window.location.reload()
                }
            }).catch(e => {
                console.log(e);
                this.setState({
                    authFlag: false,
                    errorMessage: e
                })
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
                        <div class="row">
                            {/* <p>{this.state.userID}</p> */}
                            <p>   </p>
                            <div class="col-1"></div>
                            <div class="col-3">
                                <h3><strong>Your account</strong></h3>
                                <br />
                                Change your avatar
                                {this.state.image != config.API_URL + '/null' ? <img src={this.state.image} width="200" height="200" alt="" /> : <img src={config.API_URL + '/uploads/profile/default_profile.png'} width="200" height="200" alt="" />}
                                <input
                                    accept="image/x-png,image/gif,image/jpeg"
                                    type="file"
                                    name="profilePicture"
                                    onChange={this.handleImageChange}
                                />
                            </div>
                            <div class="col-3">
                                {/* <form onSubmit={this.submitLogin} method="post"> */}
                                <div class="form-group">
                                    <label for="userName">Your name</label>
                                    <input class="form-input" style={{ fontWeight: "bold" }} value={this.state.userName} onChange={this.ChangeHandler} type="text" id="userName" class="form-control" name="userName" required></input>

                                    <label for="inputEmail">Your email address</label>
                                    <input class="form-input" style={{ fontWeight: "bold" }} value={this.state.userEmail} onChange={this.ChangeHandler} type="email" id="inputEmail" class="form-control" name="userEmail" required></input>

                                    <label for="phoneNumber">Your phone number</label>
                                    <input class="form-input" style={{ fontWeight: "bold" }} value={this.state.phoneNumber} onChange={this.ChangeHandler} type="number" id="phoneNumber" class="form-control" name="phoneNumber" required></input>
                                    <br />

                                    <div class="row">
                                        {this.state.updateFlag ? <div class="alert alert-success" role="alert">{this.state.Msg}</div> : null}
                                    </div>

                                    {/* <br /> */}
                                    {/* <button class="btn btn-primary" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }}>Save</button> */}
                                </div>
                                {/* </form> */}
                            </div>
                            <div class="col-3">
                                <div class="form-group">
                                    <label for="currency">Your default currency</label>
                                    <br />
                                    <select class="form-select form-select-md" aria-label=".form-select-sm example" value={this.state.currency} onChange={this.ChangeHandler} name="currency" id="currency" style={{ fontWeight: "bold" }}>
                                        <option value="USD">USD ($)</option>
                                        <option value="KWD">KWD (د.ك)</option>
                                        <option value="BHD">BHD (.د.ب)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="CAD">CAD ($)</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="timezone">Your time zone</label>
                                    <select class="form-select form-select-md" aria-label=".form-select-sm example" value={this.state.timezone} onChange={this.ChangeHandler} name="timezone" id="timezone" style={{ fontWeight: "bold" }}>
                                        <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                                        <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                                        <option value="-10:00">(GMT -10:00) Hawaii</option>
                                        <option value="-09:50">(GMT -9:30) Taiohae</option>
                                        <option value="-09:00">(GMT -9:00) Alaska</option>
                                        <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                                        <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                                        <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                                        <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                        <option value="-04:50">(GMT -4:30) Caracas</option>
                                        <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                        <option value="-03:50">(GMT -3:30) Newfoundland</option>
                                        <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                                        <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                                        <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                                        <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                                        <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                                        <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                                        <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                                        <option value="+03:50">(GMT +3:30) Tehran</option>
                                        <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                                        <option value="+04:50">(GMT +4:30) Kabul</option>
                                        <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                                        <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                                        <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                                        <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                                        <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                                        <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                                        <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                                        <option value="+08:75">(GMT +8:45) Eucla</option>
                                        <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                                        <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                                        <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                                        <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                                        <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                                        <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                                        <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                                        <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                                        <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                                        <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="language">Language</label>
                                    <select class="form-select form-select-md" aria-label=".form-select-sm example" value={this.state.language} onChange={this.ChangeHandler} name="language" id="language" style={{ fontWeight: "bold" }}>
                                        <option value="AF">Afrikaans</option>
                                        <option value="SQ">Albanian</option>
                                        <option value="AR">Arabic</option>
                                        <option value="HY">Armenian</option>
                                        <option value="EU">Basque</option>
                                        <option value="BN">Bengali</option>
                                        <option value="BG">Bulgarian</option>
                                        <option value="CA">Catalan</option>
                                        <option value="KM">Cambodian</option>
                                        <option value="ZH">Chinese (Mandarin)</option>
                                        <option value="HR">Croatian</option>
                                        <option value="CS">Czech</option>
                                        <option value="DA">Danish</option>
                                        <option value="NL">Dutch</option>
                                        <option value="EN">English</option>
                                        <option value="ET">Estonian</option>
                                        <option value="FJ">Fiji</option>
                                        <option value="FI">Finnish</option>
                                        <option value="FR">French</option>
                                        <option value="KA">Georgian</option>
                                        <option value="DE">German</option>
                                        <option value="EL">Greek</option>
                                        <option value="GU">Gujarati</option>
                                        <option value="HE">Hebrew</option>
                                        <option value="HI">Hindi</option>
                                        <option value="HU">Hungarian</option>
                                        <option value="IS">Icelandic</option>
                                        <option value="ID">Indonesian</option>
                                        <option value="GA">Irish</option>
                                        <option value="IT">Italian</option>
                                        <option value="JA">Japanese</option>
                                        <option value="JW">Javanese</option>
                                        <option value="KO">Korean</option>
                                        <option value="LA">Latin</option>
                                        <option value="LV">Latvian</option>
                                        <option value="LT">Lithuanian</option>
                                        <option value="MK">Macedonian</option>
                                        <option value="MS">Malay</option>
                                        <option value="ML">Malayalam</option>
                                        <option value="MT">Maltese</option>
                                        <option value="MI">Maori</option>
                                        <option value="MR">Marathi</option>
                                        <option value="MN">Mongolian</option>
                                        <option value="NE">Nepali</option>
                                        <option value="NO">Norwegian</option>
                                        <option value="FA">Persian</option>
                                        <option value="PL">Polish</option>
                                        <option value="PT">Portuguese</option>
                                        <option value="PA">Punjabi</option>
                                        <option value="QU">Quechua</option>
                                        <option value="RO">Romanian</option>
                                        <option value="RU">Russian</option>
                                        <option value="SM">Samoan</option>
                                        <option value="SR">Serbian</option>
                                        <option value="SK">Slovak</option>
                                        <option value="SL">Slovenian</option>
                                        <option value="ES">Spanish</option>
                                        <option value="SW">Swahili</option>
                                        <option value="SV">Swedish </option>
                                        <option value="TA">Tamil</option>
                                        <option value="TT">Tatar</option>
                                        <option value="TE">Telugu</option>
                                        <option value="TH">Thai</option>
                                        <option value="BO">Tibetan</option>
                                        <option value="TO">Tonga</option>
                                        <option value="TR">Turkish</option>
                                        <option value="UK">Ukrainian</option>
                                        <option value="UR">Urdu</option>
                                        <option value="UZ">Uzbek</option>
                                        <option value="VI">Vietnamese</option>
                                        <option value="CY">Welsh</option>
                                        <option value="XH">Xhosa</option>
                                    </select>
                                </div>
                                <br />
                                <div class="form-group">
                                    <button class="btn btn-primary pull-right" type="submit" onClick={this.submitUpdate} style={{ backgroundColor: "#ed752f", border: "none" }}>Save</button>

                                </div>
                            </div>
                            <div class="col-1"></div>
                            <div class="col-1"></div>

                        </div>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default Profile;