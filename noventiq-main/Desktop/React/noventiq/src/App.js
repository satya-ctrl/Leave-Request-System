import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next'; // Import I18nextProvider
import i18n from './i18n.js'; // Import i18n instance

import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
