import React from 'react';
import './Footer.css';

const Footer = () => (
  <div id="footer">
    <div className="wrap-inner">
      <p className="left">
        2424 Maile Way, Saunders Hall 540 | Honolulu, Hawaii 96822<br />
        (808) 956-2325 |
        <a href="mailto:uhero@hawaii.edu">
          <strong>uhero@hawaii.edu</strong>
        </a>
      </p>
      <p className="right">
        <strong>External Links</strong>
        <a
          href="http://www.economics.hawaii.edu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Department of Economics
        </a>
        |
        <a
          href="http://www.ssri.hawaii.edu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Social Science Research Institute
        </a>
        |
        <a
          href="http://www.socialsciences.hawaii.edu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          College of Social Sciences
        </a>
        <br />
        <strong>Website Design &amp; Development</strong>{' '}
        <a
          href="http://walltowall.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wall-to-Wall Studios
        </a>
      </p>
    </div>
  </div>
);

export default Footer;
