import React from 'react';
import './App.css';

import Header from './Header';
import Footer from './Footer';
import LineChart from './LineChart';

const App = () => (
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
          <h4 id="dash-title">Dashboard Title</h4>
          <h4 id="dash-sub-title">Dashboard Subtitle</h4>
        </div>
        <LineChart />
      </div>
    </div>
    <Footer />
  </div>
);

export default App;
