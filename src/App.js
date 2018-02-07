import React from 'react';
import './App.css';

import Header from './Header';
import Footer from './Footer';

const App = () => (
  <div className="App">
    <Header />
    <div id="content-wrapper">
      <div id="content-wrapper2">
        <div id="content-wrapper-center">
          <div id="content-wrapper-bottom">
            <div id="content">
              <div id="breadcrumb">
                <ol>
                  <li className="first">
                    <a href="http://uhero.hawaii.edu">Home</a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default App;
