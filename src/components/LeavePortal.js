import React, { useState } from 'react';
import '../css/LeavePortal.css';

const INITIAL_BALANCES = {
  annual: { name: 'Annual Leave', total: 15, used: 3, color: '#4caf50' },
  sick: { name: 'Sick Leave', total: 7, used: 2, color: '#2196f3' },
  casual: { name: 'Casual Leave', total: 5, used: 2, color: '#ff9800' }
};

const INITIAL_REQUESTS = [
  { id: 1, type: 'annual', startDate: '2026-04-10', endDate: '2026-04-12', days: 3, reason: 'Family trip', status: 'Approved' },
  { id: 2, type: 'sick', startDate: '2026-05-02', endDate: '2026-05-03', days: 2, reason: 'Flu recovery', status: 'Approved' },
  { id: 3, type: 'casual', startDate: '2026-06-15', endDate: '2026-06-16', days: 2, reason: 'Personal work', status: 'Pending' }
];

function LeavePortal() {
  const [balances, setBalances] = useState(INITIAL_BALANCES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showManagerSim, setShowManagerSim] = useState(false);

  // Calculate day difference
  const calculateDays = (start, end) => {
    const sDate = new Date(start);
    const eDate = new Date(end);
    const diffTime = Math.abs(eDate - sDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!startDate || !endDate || !reason) {
      setError('Please fill in all the fields.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    const requestedDays = calculateDays(startDate, endDate);
    const balanceLeft = balances[leaveType].total - balances[leaveType].used;

    if (requestedDays > balanceLeft) {
      setError(`Insufficient balance. You requested ${requestedDays} days, but only have ${balanceLeft} days left.`);
      return;
    }

    // Temporarily deduct quota (moves to used in pending state, refunded if rejected)
    setBalances({
      ...balances,
      [leaveType]: {
        ...balances[leaveType],
        used: balances[leaveType].used + requestedDays
      }
    });

    const newRequest = {
      id: Date.now(),
      type: leaveType,
      startDate,
      endDate,
      days: requestedDays,
      reason,
      status: 'Pending'
    };

    setRequests([newRequest, ...requests]);
    setSuccess(`Successfully submitted leave request for ${requestedDays} day(s)!`);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleApprove = (id) => {
    setRequests(requests.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Approved' };
      }
      return req;
    }));
  };

  const handleReject = (id) => {
    setRequests(requests.map(req => {
      if (req.id === id) {
        // Refund quota
        setBalances(prev => ({
          ...prev,
          [req.type]: {
            ...prev[req.type],
            used: Math.max(0, prev[req.type].used - req.days)
          }
        }));
        return { ...req, status: 'Rejected' };
      }
      return req;
    }));
  };

  return (
    <div className="leave-portal">
      <div className="portal-header">
        <h2>Leave Request System Portal</h2>
        <p className="subtitle">Manage your leaves, track balances, and apply for time off</p>
      </div>

      {/* Balance Cards Grid */}
      <div className="balance-cards">
        {Object.entries(balances).map(([key, balance]) => {
          const remaining = balance.total - balance.used;
          const percentage = (remaining / balance.total) * 100;
          return (
            <div className="balance-card" key={key} style={{ borderTop: `4px solid ${balance.color}` }}>
              <div className="card-header-quota">
                <span className="quota-name">{balance.name}</span>
                <span className="quota-pill" style={{ backgroundColor: `${balance.color}15`, color: balance.color }}>
                  {remaining} Days Left
                </span>
              </div>
              <div className="card-body-quota">
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${percentage}%`, backgroundColor: balance.color }}></div>
                </div>
                <div className="quota-footer">
                  <span>Used: {balance.used}</span>
                  <span>Total: {balance.total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Apply Form and History */}
      <div className="portal-content">
        {/* Form Card */}
        <div className="portal-card form-card">
          <h3>Apply for Leave</h3>
          {error && <div className="portal-alert alert-error">{error}</div>}
          {success && <div className="portal-alert alert-success">{success}</div>}
          
          <form onSubmit={handleRequestSubmit}>
            <div className="portal-form-group">
              <label>Leave Type</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
              </select>
            </div>

            <div className="form-row-dates">
              <div className="portal-form-group">
                <label>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="portal-form-group">
                <label>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="portal-form-group">
              <label>Reason for Leave</label>
              <textarea 
                rows="3" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="Please enter details or reasons..." 
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-submit-leave">Submit Request</button>
          </form>
        </div>

        {/* History Card */}
        <div className="portal-card history-card">
          <h3>Leave History & Status</h3>
          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-table">No requests found.</td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td className="capitalize">{req.type}</td>
                      <td>
                        <span className="date-range">{req.startDate} to {req.endDate}</span>
                        <span className="reason-text">{req.reason}</span>
                      </td>
                      <td>{req.days}</td>
                      <td>
                        <span className={`status-badge ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Simulator Panel (Manager View) */}
      <div className="simulator-toggle-area">
        <button className="btn-simulator-toggle" onClick={() => setShowManagerSim(!showManagerSim)}>
          {showManagerSim ? 'Hide Manager Control Panel' : 'Show Manager Approval Simulator'}
        </button>
      </div>

      {showManagerSim && (
        <div className="portal-card simulator-card">
          <h3>Manager Approval Simulator (Admin Mode)</h3>
          <p className="simulator-desc">Simulate a manager approving or rejecting pending leave requests in real time.</p>
          <div className="simulator-list">
            {requests.filter(r => r.status === 'Pending').length === 0 ? (
              <p className="empty-simulator">No pending requests to approve/reject. Try submitting one above!</p>
            ) : (
              requests.filter(r => r.status === 'Pending').map(req => (
                <div className="simulator-item" key={req.id}>
                  <div className="sim-details">
                    <span className="sim-type">{balances[req.type].name} ({req.days} days)</span>
                    <span className="sim-meta">Dates: {req.startDate} to {req.endDate} | Reason: "{req.reason}"</span>
                  </div>
                  <div className="sim-actions">
                    <button className="btn-sim-approve" onClick={() => handleApprove(req.id)}>
                      <i className="fas fa-check"></i> Approve
                    </button>
                    <button className="btn-sim-reject" onClick={() => handleReject(req.id)}>
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeavePortal;
