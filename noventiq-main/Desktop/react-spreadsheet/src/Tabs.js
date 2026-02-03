// Tabs.js
import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab, addTab }) => {
  return (
    <div className="tabs">
      <ul className="tab-list">
        {tabs.map((tab, index) => (
          <li
            key={tab.id}
            className={`tab-item ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </li>
        ))}
        <li className="tab-item add-tab" onClick={addTab}>+ Add Tab</li>
      </ul>
    </div>
  );
};

export default Tabs;
