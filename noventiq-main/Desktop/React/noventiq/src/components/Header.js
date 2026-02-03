import React from 'react';
import '../css/Header.css';
import logo from '../logo.svg';

function Header() {
  return (
    <div className="header-container">
      <header className="header">
        <img src={logo} alt="logo" className='logo'/>
      </header>
    </div>
  );
}

export default Header;
