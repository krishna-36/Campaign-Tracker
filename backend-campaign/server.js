const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'campaigns.json');

// ensure file exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/campaigns', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/campaigns', (req, res) => {
  const { campaignName, clientName, startDate, status } = req.body;
  if (!campaignName || !clientName || !startDate) {
    return res.status(400).json({ error: 'campaignName, clientName and startDate are required' });
  }
  const campaigns = readData();
  const newItem = {
    id: uuidv4(),
    campaignName,
    clientName,
    startDate,
    status: status || 'Active',
    createdAt: new Date().toISOString()
  };
  campaigns.unshift(newItem);
  writeData(campaigns);
  res.status(201).json(newItem);
});

app.put('/campaigns/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  let campaigns = readData();
  const idx = campaigns.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  campaigns[idx] = { ...campaigns[idx], ...updates, updatedAt: new Date().toISOString() };
  writeData(campaigns);
  res.json(campaigns[idx]);
});

app.delete('/campaigns/:id', (req, res) => {
  const id = req.params.id;
  let campaigns = readData();
  const newList = campaigns.filter(c => c.id !== id);
  if (newList.length === campaigns.length) return res.status(404).json({ error: 'Not found' });
  writeData(newList);
  res.json({ success: true });
});

// simple health
app.get('/', (req, res) => res.send('Campaign Tracker API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
