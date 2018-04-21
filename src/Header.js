import React from 'react';
import './Header.css';

const Header = () => (
  <header id="header">
    <div className="header-wrapper">
      <form className="mailing-list" action="">
        <fieldset>
          <ul className="topmenu">
            <li>
              <a
                href="http://www.facebook.com/pages/uhero-The-Economic-Research-Organization-at-the-University-of-Hawaii/144885908919188?sk=wall"
                className="facebook"
                rel="noopener noreferrer"
                target="_blank"
              >
                Like Us on Facebook
              </a>
              |
              <a href="http://www.uhero.hawaii.edu/4/become-a-sponsor">
                Become a Sponsor
              </a>
              |
              <a
                className="email"
                href="http://www.uhero.hawaii.edu/31/contact"
              >
                Join Mailing List
              </a>
            </li>
          </ul>
        </fieldset>
      </form>
      <h1>
        <a href="http://uhero.hawaii.edu">
          UHERO the economic research organization at the university of Hawaii
        </a>
      </h1>
      <form
        className="search"
        acceptCharset="utf-8"
        method="get"
        action="/search"
      >
        <fieldset>
          <input
            name="q"
            className="text"
            defaultValue="Search"
            title="Search"
            id="SearchQ"
            type="text"
          />
          <input value="search" type="submit" />
        </fieldset>
      </form>
    </div>
  </header>
);

export default Header;
