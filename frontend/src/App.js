import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store'

//App Component
class App extends Component {
  render() {
    return (
      //Use Browser Router to route to different pages
      <Provider store = {store}>
        <div>
          <BrowserRouter>
            <div>
              {/* App Component Has a Child Component called Main*/}
              <Main/>
            </div>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}
//Export the App component so that it can be used in index.js
export default App;
