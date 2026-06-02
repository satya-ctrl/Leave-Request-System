import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LeavePortal from './LeavePortal';
import Spreadsheet from './Spreadsheet';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves' or 'spreadsheet'

  return (
    <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} showNav={true} />
      <main className="dashboard-main" style={{ flex: 1, padding: '20px 0 100px 0' }}>
        {activeTab === 'leaves' ? <LeavePortal /> : <Spreadsheet />}
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
