import React from 'react';

export default function CampaignList({ campaigns, onUpdate, onDelete }) {
  if (!campaigns.length) return <p style={{ marginTop: 12 }}>No campaigns found.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Campaign</th>
          <th>Client</th>
          <th>Start</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map(c => (
          <tr key={c.id}>
            <td>{c.campaignName}</td>
            <td>{c.clientName}</td>
            <td>{new Date(c.startDate).toLocaleDateString()}</td>
            <td>
              <select value={c.status} onChange={e=>onUpdate(c.id, { status: e.target.value })}>
                <option>Active</option>
                <option>Paused</option>
                <option>Completed</option>
              </select>
            </td>
            <td>
              <button className="btn-delete" onClick={() => { if (window.confirm('Delete?')) onDelete(c.id); }}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
