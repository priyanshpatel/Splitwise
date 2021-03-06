import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
// import signupReducer from './signReducer';

export default combineReducers({
    login: loginReducer,
    logout: loginReducer,
    signup: signupReducer
});