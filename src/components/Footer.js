import React from 'react';
import '../css/Footer.css';

function Footer() {
    return (
      <div className="footer-container">
        <footer className="footer">
          <p className="footer-para">Copyright 2024 Noventiq | Powered by Noventiq</p>
          <div className="developer-badge">
            Developed by <span className="dev-name">Satya</span>
          </div>
        </footer>
      </div>
    );
  }
  
  export default Footer;