import React from 'react';
import './App.css';

import Header from './Header';
import Footer from './Footer';
import Visualization from './Visualization';

const App = () => {
  return (
    <div className="App">
      <Header />
      <div id="content-wrapper">
        <div id="content">
          <div id="breadcrumb">
            <ol>
              <li className="first">
                <a href="http://uhero.hawaii.edu">Home</a>
              </li>
            </ol>
          </div>
          <div id="dashboard-title">
            <h4 id="dash-title">ACS Explorer</h4>
          </div>
          <Visualization />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App;
