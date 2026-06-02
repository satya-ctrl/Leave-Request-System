import React from 'react';
import '../css/Header.css';
import logo from '../logo.svg';

function Header({ activeTab, setActiveTab, showNav }) {
  return (
    <div className={`header-container ${showNav ? 'with-nav' : ''}`}>
      <header className="header">
        <div className="header-logo-section">
          <img src={logo} alt="logo" className='logo'/>
        </div>
        {showNav && (
          <nav className="header-nav">
            <button 
              className={`nav-btn ${activeTab === 'leaves' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaves')}
            >
              <i className="fas fa-calendar-alt"></i> Leave Requests
            </button>
            <button 
              className={`nav-btn ${activeTab === 'spreadsheet' ? 'active' : ''}`}
              onClick={() => setActiveTab('spreadsheet')}
            >
              <i className="fas fa-file-excel"></i> Portfolio Spreadsheet
            </button>
          </nav>
        )}
      </header>
    </div>
  );
}

export default Header;
