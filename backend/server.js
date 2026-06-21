const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read DB
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { parts: [], configurations: [] };
  }
}

// Helper function to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
}

// Helper: Get active cost of a part on a given date (YYYY-MM-DD)
function getActiveCost(part, targetDateStr) {
  if (!part.priceHistory || part.priceHistory.length === 0) {
    return 0;
  }
  // Sort history by date ascending
  const sortedHistory = [...part.priceHistory].sort((a, b) => a.date.localeCompare(b.date));
  
  let activeCost = sortedHistory[0].cost;
  for (const entry of sortedHistory) {
    if (entry.date <= targetDateStr) {
      activeCost = entry.cost;
    } else {
      break;
    }
  }
  return activeCost;
}

// API Routes

// 1. PARTS ENDPOINTS
app.get('/api/parts', (req, res) => {
  const db = readDb();
  res.json(db.parts);
});

app.post('/api/parts', (req, res) => {
  const { name, category, initialCost, date } = req.body;
  if (!name || !category || initialCost === undefined) {
    return res.status(400).json({ error: 'Name, category, and initialCost are required.' });
  }

  const db = readDb();
  const dateStr = date || new Date().toISOString().split('T')[0];
  const newPart = {
    id: `part-${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    name,
    category,
    priceHistory: [{ date: dateStr, cost: Number(initialCost) }]
  };

  db.parts.push(newPart);
  writeDb(db);
  res.status(201).json(newPart);
});

// Add a new price point to a part
app.post('/api/parts/:id/price', (req, res) => {
  const { id } = req.params;
  const { date, cost } = req.body;

  if (!date || cost === undefined) {
    return res.status(400).json({ error: 'Date and cost are required.' });
  }

  const db = readDb();
  const part = db.parts.find(p => p.id === id);
  if (!part) {
    return res.status(404).json({ error: 'Part not found.' });
  }

  // Remove existing entry on the same date if any, or just update it
  part.priceHistory = part.priceHistory.filter(h => h.date !== date);
  part.priceHistory.push({ date, cost: Number(cost) });
  // Sort history for clean keeping
  part.priceHistory.sort((a, b) => a.date.localeCompare(b.date));

  writeDb(db);
  res.json(part);
});

// Edit basic part info
app.put('/api/parts/:id', (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const db = readDb();
  const part = db.parts.find(p => p.id === id);
  if (!part) {
    return res.status(404).json({ error: 'Part not found.' });
  }

  if (name) part.name = name;
  if (category) part.category = category;

  writeDb(db);
  res.json(part);
});

// Delete a part
app.delete('/api/parts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  
  const initialCount = db.parts.length;
  db.parts = db.parts.filter(p => p.id !== id);
  
  if (db.parts.length === initialCount) {
    return res.status(404).json({ error: 'Part not found.' });
  }

  // Also remove from any configurations
  db.configurations = db.configurations.map(config => ({
    ...config,
    parts: config.parts.filter(partId => partId !== id)
  }));

  writeDb(db);
  res.json({ message: 'Part deleted successfully.', id });
});


// 2. CONFIGURATIONS ENDPOINTS
app.get('/api/configurations', (req, res) => {
  const db = readDb();
  res.json(db.configurations);
});

app.post('/api/configurations', (req, res) => {
  const { name, description, parts, overheadCharges, profitMarginPercentage } = req.body;
  if (!name || !parts || !Array.isArray(parts)) {
    return res.status(400).json({ error: 'Name and parts (array) are required.' });
  }

  const db = readDb();
  const newConfig = {
    id: `config-${Date.now()}`,
    name,
    description: description || '',
    parts,
    overheadCharges: Number(overheadCharges) || 0,
    profitMarginPercentage: Number(profitMarginPercentage) || 0
  };

  db.configurations.push(newConfig);
  writeDb(db);
  res.status(201).json(newConfig);
});

// Edit configuration
app.put('/api/configurations/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, parts, overheadCharges, profitMarginPercentage } = req.body;

  const db = readDb();
  const configIndex = db.configurations.findIndex(c => c.id === id);
  if (configIndex === -1) {
    return res.status(404).json({ error: 'Configuration not found.' });
  }

  const existingConfig = db.configurations[configIndex];
  db.configurations[configIndex] = {
    ...existingConfig,
    name: name !== undefined ? name : existingConfig.name,
    description: description !== undefined ? description : existingConfig.description,
    parts: parts !== undefined ? parts : existingConfig.parts,
    overheadCharges: overheadCharges !== undefined ? Number(overheadCharges) : existingConfig.overheadCharges,
    profitMarginPercentage: profitMarginPercentage !== undefined ? Number(profitMarginPercentage) : existingConfig.profitMarginPercentage
  };

  writeDb(db);
  res.json(db.configurations[configIndex]);
});

// Delete configuration
app.delete('/api/configurations/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const initialCount = db.configurations.length;
  db.configurations = db.configurations.filter(c => c.id !== id);

  if (db.configurations.length === initialCount) {
    return res.status(404).json({ error: 'Configuration not found.' });
  }

  writeDb(db);
  res.json({ message: 'Configuration deleted successfully.', id });
});


// 3. PRICING ENGINE CALCULATION ENDPOINT
app.get('/api/calculate', (req, res) => {
  const { configId, parts, date, overheadCharges, profitMarginPercentage } = req.query;
  const db = readDb();

  let targetConfig = null;
  let partIdsToCalculate = [];
  let nameOfCalculation = 'Custom Sandbox';
  let resolvedOverhead = 0;
  let resolvedMarginPct = 0;

  if (configId) {
    targetConfig = db.configurations.find(c => c.id === configId);
    if (!targetConfig) {
      return res.status(404).json({ error: 'Configuration not found.' });
    }
    partIdsToCalculate = targetConfig.parts;
    nameOfCalculation = targetConfig.name;
    resolvedOverhead = targetConfig.overheadCharges;
    resolvedMarginPct = targetConfig.profitMarginPercentage;
  } else if (parts) {
    partIdsToCalculate = parts.split(',');
  } else {
    return res.status(400).json({ error: 'Specify either configId or parts parameter.' });
  }

  // Override charges if provided in query
  if (overheadCharges !== undefined) {
    resolvedOverhead = Number(overheadCharges);
  }
  if (profitMarginPercentage !== undefined) {
    resolvedMarginPct = Number(profitMarginPercentage);
  }

  // Use current date if none is specified
  const targetDateStr = date || new Date().toISOString().split('T')[0];

  // Resolve parts and cost breakdown
  const resolvedPartsBreakdown = [];
  let partsCostTotal = 0;

  for (const partId of partIdsToCalculate) {
    const part = db.parts.find(p => p.id === partId);
    if (part) {
      const activeCost = getActiveCost(part, targetDateStr);
      resolvedPartsBreakdown.push({
        id: part.id,
        name: part.name,
        category: part.category,
        cost: activeCost
      });
      partsCostTotal += activeCost;
    }
  }

  const subtotal = partsCostTotal + resolvedOverhead;
  const marginAmount = Number((subtotal * (resolvedMarginPct / 100)).toFixed(2));
  const preTaxTotal = subtotal + marginAmount;
  const taxPercentage = 18; // 18% GST standard in India
  const taxAmount = Number((preTaxTotal * (taxPercentage / 100)).toFixed(2));
  const finalTotal = Number((preTaxTotal + taxAmount).toFixed(2));

  res.json({
    name: nameOfCalculation,
    configurationId: configId || null,
    date: targetDateStr,
    parts: resolvedPartsBreakdown,
    partsCost: partsCostTotal,
    overheadCharges: resolvedOverhead,
    subtotal: subtotal,
    profitMarginPercentage: resolvedMarginPct,
    marginAmount: marginAmount,
    preTaxTotal: preTaxTotal,
    taxPercentage: taxPercentage,
    taxAmount: taxAmount,
    finalTotal: finalTotal
  });
});

app.listen(PORT, () => {
  console.log(`Hero Cycles Pricing Engine server running on port ${PORT}`);
});
