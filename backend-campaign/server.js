require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🧱 Schema and Model
const campaignSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  campaignName: { type: String, required: true },
  clientName: { type: String, required: true },
  startDate: { type: String, required: true },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const Campaign = mongoose.model('Campaign', campaignSchema);

// 🚀 Routes
app.get('/', (req, res) => res.send('Campaign Tracker API running with MongoDB'));

// Get all campaigns
app.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Add a new campaign
app.post('/campaigns', async (req, res) => {
  try {
    const { campaignName, clientName, startDate, status } = req.body;
    if (!campaignName || !clientName || !startDate) {
      return res.status(400).json({ error: 'campaignName, clientName and startDate are required' });
    }

    const newCampaign = new Campaign({
      campaignName,
      clientName,
      startDate,
      status
    });

    const saved = await newCampaign.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign by ID
app.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date() };
    const updated = await Campaign.findOneAndUpdate({ id }, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign by ID
app.delete('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Campaign.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// 🧠 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
