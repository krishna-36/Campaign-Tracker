import React, { useState } from 'react';

export default function CampaignForm({ onAdd }) {
  const [campaignName, setCampaignName] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState('Active');

  function clear() {
    setCampaignName(''); setClientName(''); setStartDate(''); setStatus('Active');
  }

  async function submit(e) {
    e.preventDefault();
    if (!campaignName || !clientName || !startDate) return alert('Please fill required fields');
    await onAdd({ campaignName, clientName, startDate, status });
    clear();
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="row">
        <input placeholder="Campaign Name *" value={campaignName} onChange={e=>setCampaignName(e.target.value)} />
        <input placeholder="Client Name *" value={clientName} onChange={e=>setClientName(e.target.value)} />
      </div>
      <div className="row">
        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Active</option>
          <option>Paused</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="row">
        <button type="submit">Add Campaign</button>
      </div>
    </form>
  );
}
