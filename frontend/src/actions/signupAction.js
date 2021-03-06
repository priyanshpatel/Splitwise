import { USER_SIGNUP } from './types';
import axios from "axios";

export const userSignup = (signupData) => dispatch => {
    console.log("===========inside signupAction==============");
    console.log(signupData);
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/signup', signupData)
        .then(response => dispatch({
            type: USER_SIGNUP,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data){
                return dispatch({
                    type: USER_SIGNUP,
                    payload: error.response.data
                });
            }
        });
}