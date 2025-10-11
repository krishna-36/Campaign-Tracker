import React, { useEffect, useState } from 'react';
import CampaignForm from './CampaignForm';
import CampaignList from './CampaignList';
import Login from './Login';
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [query, setQuery] = useState('');
  const [token, setToken] = useState(localStorage.getItem('dummy_token') || null);

  useEffect(() => {
    if (token) fetchCampaigns();
  }, [token]);

  async function fetchCampaigns() {
    try {
      const res = await fetch(`${API}/campaigns`);
      const data = await res.json();
      setCampaigns(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function addCampaign(c) {
    const res = await fetch(`${API}/campaigns`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(c)
    });
    const data = await res.json();
    setCampaigns(prev => [data, ...prev]);
  }

  async function updateCampaign(id, updates) {
    const res = await fetch(`${API}/campaigns/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    setCampaigns(prev => prev.map(p => p.id === id ? data : p));
  }

  async function deleteCampaign(id) {
    await fetch(`${API}/campaigns/${id}`, { method: 'DELETE' });
    setCampaigns(prev => prev.filter(p => p.id !== id));
  }

  const counts = campaigns.reduce((acc, c) => {
    acc.total = (acc.total || 0) + 1;
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, { total: 0 });

  const visible = campaigns.filter(c =>
    c.campaignName.toLowerCase().includes(query.toLowerCase()) ||
    c.clientName.toLowerCase().includes(query.toLowerCase())
  );

  if (!token) return <Login onLogin={(t)=>{ setToken(t); localStorage.setItem('dummy_token', t); }} />;

  return (
    <div className="container">
      <header>
        <h1>Campaign Tracker</h1>
        <div>
          <button className="logout" onClick={() => { localStorage.removeItem('dummy_token'); setToken(null); }}>Logout</button>
        </div>
      </header>

      <section className="dashboard">
        <div className="card"><h4>Total</h4><p>{counts.total || 0}</p></div>
        <div className="card"><h4>Active</h4><p>{counts['Active'] || 0}</p></div>
        <div className="card"><h4>Paused</h4><p>{counts['Paused'] || 0}</p></div>
        <div className="card"><h4>Completed</h4><p>{counts['Completed'] || 0}</p></div>
      </section>

      <CampaignForm onAdd={addCampaign} />

      <div style={{ marginTop: 12 }}>
        <input className="search" placeholder="Search campaign or client..." value={query} onChange={e=>setQuery(e.target.value)} />
      </div>

      <CampaignList campaigns={visible} onUpdate={updateCampaign} onDelete={deleteCampaign} />
    </div>
  );
}
