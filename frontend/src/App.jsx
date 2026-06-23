import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const MONTHS_2026 = [
  { value: 0, label: 'Jan', dateStr: '2026-01-01' },
  { value: 1, label: 'Feb', dateStr: '2026-02-01' },
  { value: 2, label: 'Mar', dateStr: '2026-03-01' },
  { value: 3, label: 'Apr', dateStr: '2026-04-01' },
  { value: 4, label: 'May', dateStr: '2026-05-01' },
  { value: 5, label: 'Jun', dateStr: '2026-06-01' },
  { value: 6, label: 'Jul', dateStr: '2026-07-01' },
  { value: 7, label: 'Aug', dateStr: '2026-08-01' },
  { value: 8, label: 'Sep', dateStr: '2026-09-01' },
  { value: 9, label: 'Oct', dateStr: '2026-10-01' },
  { value: 10, label: 'Nov', dateStr: '2026-11-01' },
  { value: 11, label: 'Dec', dateStr: '2026-12-01' }
];

const SEED_PARTS = [
  {
    id: "part-frame-steel",
    name: "Frame - Steel Heavy Duty",
    category: "Frame",
    priceHistory: [
      { date: "2026-01-01", cost: 1200 },
      { date: "2026-04-01", cost: 1300 },
      { date: "2026-06-01", cost: 1350 }
    ]
  },
  {
    id: "part-frame-aluminum",
    name: "Frame - Aluminum Alloy Light",
    category: "Frame",
    priceHistory: [
      { date: "2026-01-01", cost: 2500 },
      { date: "2026-04-01", cost: 2700 }
    ]
  },
  {
    id: "part-frame-carbon",
    name: "Frame - Carbon Fiber Pro",
    category: "Frame",
    priceHistory: [
      { date: "2026-01-01", cost: 7500 },
      { date: "2026-05-01", cost: 8000 }
    ]
  },
  {
    id: "part-gear-single",
    name: "Single Speed Standard Gear",
    category: "Gear",
    priceHistory: [
      { date: "2026-01-01", cost: 350 }
    ]
  },
  {
    id: "part-gear-7spd",
    name: "7-Speed Shimano Gearset",
    category: "Gear",
    priceHistory: [
      { date: "2026-01-01", cost: 1200 },
      { date: "2026-03-01", cost: 1300 }
    ]
  },
  {
    id: "part-gear-21spd",
    name: "21-Speed Shimano Tourney Gearset",
    category: "Gear",
    priceHistory: [
      { date: "2026-01-01", cost: 2500 },
      { date: "2026-06-01", cost: 2800 }
    ]
  },
  {
    id: "part-tyre-road",
    name: "Standard Road Tyre (Pair)",
    category: "Tyre",
    priceHistory: [
      { date: "2026-01-01", cost: 400 },
      { date: "2026-03-01", cost: 450 },
      { date: "2026-06-01", cost: 480 }
    ]
  },
  {
    id: "part-tyre-mtb",
    name: "Offroad Mountain Tyre (Pair)",
    category: "Tyre",
    priceHistory: [
      { date: "2026-01-01", cost: 600 },
      { date: "2026-04-01", cost: 680 }
    ]
  },
  {
    id: "part-tyre-tubeless",
    name: "Tubeless Racing Tyre (Pair)",
    category: "Tyre",
    priceHistory: [
      { date: "2026-01-01", cost: 1500 },
      { date: "2026-06-01", cost: 1650 }
    ]
  },
  {
    id: "part-brake-caliper",
    name: "Caliper Brakes Set",
    category: "Brake",
    priceHistory: [
      { date: "2026-01-01", cost: 250 }
    ]
  },
  {
    id: "part-brake-disc",
    name: "Disc Brakes Set",
    category: "Brake",
    priceHistory: [
      { date: "2026-01-01", cost: 800 },
      { date: "2026-04-01", cost: 850 }
    ]
  },
  {
    id: "part-saddle-gel",
    name: "Comfort Gel Saddle",
    category: "Saddle",
    priceHistory: [
      { date: "2026-01-01", cost: 300 }
    ]
  },
  {
    id: "part-saddle-sports",
    name: "Sports Aerodynamic Saddle",
    category: "Saddle",
    priceHistory: [
      { date: "2026-01-01", cost: 500 },
      { date: "2026-05-01", cost: 550 }
    ]
  },
  {
    id: "part-handlebar-straight",
    name: "Straight Handlebar",
    category: "Handlebar",
    priceHistory: [
      { date: "2026-01-01", cost: 200 }
    ]
  },
  {
    id: "part-handlebar-drop",
    name: "Drop-bar Racing Handlebar",
    category: "Handlebar",
    priceHistory: [
      { date: "2026-01-01", cost: 600 }
    ]
  }
];

const SEED_CONFIGS = [
  {
    id: "config-ranger",
    name: "Hero Ranger",
    description: "Standard heavy-duty steel commuter bike for daily usage",
    parts: [
      "part-frame-steel",
      "part-gear-single",
      "part-tyre-road",
      "part-brake-caliper",
      "part-saddle-gel",
      "part-handlebar-straight"
    ],
    overheadCharges: 350,
    profitMarginPercentage: 12
  },
  {
    id: "config-sprint-pro",
    name: "Hero Sprint Pro",
    description: "Lightweight alloy hybrid bicycle with multi-gears for sport enthusiasts",
    parts: [
      "part-frame-aluminum",
      "part-gear-7spd",
      "part-tyre-road",
      "part-brake-disc",
      "part-saddle-sports",
      "part-handlebar-straight"
    ],
    overheadCharges: 500,
    profitMarginPercentage: 15
  },
  {
    id: "config-octane-carbon",
    name: "Hero Octane Carbon Pro",
    description: "High-performance carbon-fiber road bike with 21-speed transmission",
    parts: [
      "part-frame-carbon",
      "part-gear-21spd",
      "part-tyre-tubeless",
      "part-brake-disc",
      "part-saddle-sports",
      "part-handlebar-drop"
    ],
    overheadCharges: 800,
    profitMarginPercentage: 18
  }
];

const mockDb = {
  getParts: () => {
    const data = localStorage.getItem('hero_parts');
    if (!data) {
      localStorage.setItem('hero_parts', JSON.stringify(SEED_PARTS));
      return SEED_PARTS;
    }
    return JSON.parse(data);
  },
  saveParts: (parts) => {
    localStorage.setItem('hero_parts', JSON.stringify(parts));
  },
  getConfigurations: () => {
    const data = localStorage.getItem('hero_configs');
    if (!data) {
      localStorage.setItem('hero_configs', JSON.stringify(SEED_CONFIGS));
      return SEED_CONFIGS;
    }
    return JSON.parse(data);
  },
  saveConfigurations: (configs) => {
    localStorage.setItem('hero_configs', JSON.stringify(configs));
  },
  getActiveCost: (part, targetDateStr) => {
    if (!part.priceHistory || part.priceHistory.length === 0) return 0;
    const sorted = [...part.priceHistory].sort((a, b) => a.date.localeCompare(b.date));
    let activeCost = sorted[0].cost;
    for (const entry of sorted) {
      if (entry.date <= targetDateStr) {
        activeCost = entry.cost;
      } else {
        break;
      }
    }
    return activeCost;
  },
  calculate: (configId, queryDate, overheadOverride, marginOverride) => {
    const parts = mockDb.getParts();
    const configs = mockDb.getConfigurations();
    const config = configs.find(c => c.id === configId);
    if (!config) return null;

    const resolvedOverhead = overheadOverride !== '' ? Number(overheadOverride) : config.overheadCharges;
    const resolvedMarginPct = marginOverride !== '' ? Number(marginOverride) : config.profitMarginPercentage;

    const resolvedParts = [];
    let partsCostTotal = 0;

    for (const partId of config.parts) {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const cost = mockDb.getActiveCost(part, queryDate);
        resolvedParts.push({
          id: part.id,
          name: part.name,
          category: part.category,
          cost: cost
        });
        partsCostTotal += cost;
      }
    }

    const subtotal = partsCostTotal + resolvedOverhead;
    const marginAmount = Number((subtotal * (resolvedMarginPct / 100)).toFixed(2));
    const preTaxTotal = subtotal + marginAmount;
    const taxPercentage = 18;
    const taxAmount = Number((preTaxTotal * (taxPercentage / 100)).toFixed(2));
    const finalTotal = Number((preTaxTotal + taxAmount).toFixed(2));

    return {
      name: config.name,
      configurationId: config.id,
      date: queryDate,
      parts: resolvedParts,
      partsCost: partsCostTotal,
      overheadCharges: resolvedOverhead,
      subtotal: subtotal,
      profitMarginPercentage: resolvedMarginPct,
      marginAmount: marginAmount,
      preTaxTotal: preTaxTotal,
      taxPercentage: taxPercentage,
      taxAmount: taxAmount,
      finalTotal: finalTotal
    };
  }
};

function App() {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState('simulator'); // simulator, parts, configs
  
  // Data states
  const [parts, setParts] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Simulation states
  const [simulationMonth, setSimulationMonth] = useState(5); // June 2026 default
  const [simulationDate, setSimulationDate] = useState('2026-06-01');
  const [simOverheadOverride, setSimOverheadOverride] = useState('');
  const [simMarginOverride, setSimMarginOverride] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);

  // Management states
  const [alert, setAlert] = useState(null);
  
  // Part Form states
  const [newPartName, setNewPartName] = useState('');
  const [newPartCategory, setNewPartCategory] = useState('Frame');
  const [newPartCost, setNewPartCost] = useState('');
  const [newPartDate, setNewPartDate] = useState('2026-01-01');
  const [selectedPartForPrice, setSelectedPartForPrice] = useState(null);
  const [newPriceDate, setNewPriceDate] = useState('2026-06-01');
  const [newPriceCost, setNewPriceCost] = useState('');

  // Config Form states
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigDesc, setNewConfigDesc] = useState('');
  const [newConfigParts, setNewConfigParts] = useState([]);
  const [newConfigOverhead, setNewConfigOverhead] = useState('500');
  const [newConfigMargin, setNewConfigMargin] = useState('15');
  const [editingConfigId, setEditingConfigId] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchParts();
    fetchConfigurations();
  }, []);

  // Sync Slider to Calendar date
  useEffect(() => {
    const selectedMonth = MONTHS_2026.find(m => m.value === Number(simulationMonth));
    if (selectedMonth) {
      setSimulationDate(selectedMonth.dateStr);
    }
  }, [simulationMonth]);

  // Recalculate price when dependencies change
  useEffect(() => {
    if (selectedConfig) {
      runCalculation();
    } else if (configurations.length > 0 && !selectedConfig) {
      setSelectedConfig(configurations[0]);
    }
  }, [selectedConfig, simulationDate, simOverheadOverride, simMarginOverride, configurations]);

  const triggerAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchParts = async () => {
    try {
      const res = await fetch(`${API_BASE}/parts`);
      if (res.ok) {
        const data = await res.json();
        setParts(data);
      } else {
        throw new Error('Backend returned non-ok status');
      }
    } catch (err) {
      console.warn('Backend parts query failed, switching to Local Spec Mode.', err);
      setIsOfflineMode(true);
      const data = mockDb.getParts();
      setParts(data);
    }
  };

  const fetchConfigurations = async () => {
    try {
      const res = await fetch(`${API_BASE}/configurations`);
      if (res.ok) {
        const data = await res.json();
        setConfigurations(data);
        if (data.length > 0 && !selectedConfig) {
          setSelectedConfig(data[0]);
        }
      } else {
        throw new Error('Backend returned non-ok status');
      }
    } catch (err) {
      console.warn('Backend configs query failed, switching to Local Spec Mode.', err);
      setIsOfflineMode(true);
      const data = mockDb.getConfigurations();
      setConfigurations(data);
      if (data.length > 0 && !selectedConfig) {
        setSelectedConfig(data[0]);
      }
    }
  };

  const runCalculation = async () => {
    if (!selectedConfig) return;
    if (isOfflineMode) {
      const data = mockDb.calculate(selectedConfig.id, simulationDate, simOverheadOverride, simMarginOverride);
      setCalculationResult(data);
      return;
    }
    try {
      let url = `${API_BASE}/calculate?configId=${selectedConfig.id}&date=${simulationDate}`;
      if (simOverheadOverride !== '') {
        url += `&overheadCharges=${simOverheadOverride}`;
      }
      if (simMarginOverride !== '') {
        url += `&profitMarginPercentage=${simMarginOverride}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCalculationResult(data);
      } else {
        throw new Error('Calculation query non-ok status');
      }
    } catch (err) {
      console.warn('Calculation API failed, running locally.', err);
      setIsOfflineMode(true);
      const data = mockDb.calculate(selectedConfig.id, simulationDate, simOverheadOverride, simMarginOverride);
      setCalculationResult(data);
    }
  };

  // Add a Part
  const handleAddPart = async (e) => {
    e.preventDefault();
    if (!newPartName || !newPartCost) return;

    if (isOfflineMode) {
      const currentParts = mockDb.getParts();
      const newPart = {
        id: `part-${newPartCategory.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: newPartName,
        category: newPartCategory,
        priceHistory: [{ date: newPartDate, cost: Number(newPartCost) }]
      };
      const updated = [...currentParts, newPart];
      mockDb.saveParts(updated);
      setNewPartName('');
      setNewPartCost('');
      setParts(updated);
      triggerAlert(`Component "${newPartName}" added to local registry.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPartName,
          category: newPartCategory,
          initialCost: Number(newPartCost),
          date: newPartDate
        })
      });
      if (res.ok) {
        triggerAlert(`Component "${newPartName}" added successfully.`);
        setNewPartName('');
        setNewPartCost('');
        fetchParts();
      } else {
        triggerAlert('Error adding component.', 'error');
      }
    } catch (err) {
      triggerAlert('Network error.', 'error');
    }
  };

  // Add a Price Change entry
  const handleAddPriceChange = async (e) => {
    e.preventDefault();
    if (!selectedPartForPrice || !newPriceCost || !newPriceDate) return;

    if (isOfflineMode) {
      const currentParts = mockDb.getParts();
      const partIdx = currentParts.findIndex(p => p.id === selectedPartForPrice.id);
      if (partIdx !== -1) {
        const history = currentParts[partIdx].priceHistory.filter(h => h.date !== newPriceDate);
        history.push({ date: newPriceDate, cost: Number(newPriceCost) });
        history.sort((a, b) => a.date.localeCompare(b.date));
        currentParts[partIdx].priceHistory = history;
        mockDb.saveParts(currentParts);
        triggerAlert(`Added local price ₹${newPriceCost} for ${selectedPartForPrice.name}.`);
        setNewPriceCost('');
        setSelectedPartForPrice(null);
        setParts(currentParts);
        // Recalc
        runCalculation();
      }
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/parts/${selectedPartForPrice.id}/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newPriceDate,
          cost: Number(newPriceCost)
        })
      });
      if (res.ok) {
        triggerAlert(`Added new price ₹${newPriceCost} for ${selectedPartForPrice.name}.`);
        setNewPriceCost('');
        setSelectedPartForPrice(null);
        fetchParts();
        // Force recalc
        runCalculation();
      } else {
        triggerAlert('Error adding price history point.', 'error');
      }
    } catch (err) {
      triggerAlert('Network error.', 'error');
    }
  };

  // Delete a Part
  const handleDeletePart = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove it from all configurations.`)) return;

    if (isOfflineMode) {
      const currentParts = mockDb.getParts().filter(p => p.id !== id);
      mockDb.saveParts(currentParts);
      setParts(currentParts);

      // Remove from local configs
      const currentConfigs = mockDb.getConfigurations().map(config => ({
        ...config,
        parts: config.parts.filter(partId => partId !== id)
      }));
      mockDb.saveConfigurations(currentConfigs);
      setConfigurations(currentConfigs);
      triggerAlert(`Deleted local component "${name}".`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/parts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerAlert(`Deleted "${name}".`);
        fetchParts();
        fetchConfigurations();
      }
    } catch (err) {
      triggerAlert('Error deleting part.', 'error');
    }
  };

  // Toggle selected part checkboxes for configuration builder
  const toggleConfigPartSelection = (partId) => {
    if (newConfigParts.includes(partId)) {
      setNewConfigParts(newConfigParts.filter(id => id !== partId));
    } else {
      setNewConfigParts([...newConfigParts, partId]);
    }
  };

  // Add or Edit a Configuration
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!newConfigName || newConfigParts.length === 0) {
      triggerAlert('Name and at least one part selection are required.', 'error');
      return;
    }

    const payload = {
      name: newConfigName,
      description: newConfigDesc,
      parts: newConfigParts,
      overheadCharges: Number(newConfigOverhead),
      profitMarginPercentage: Number(newConfigMargin)
    };

    if (isOfflineMode) {
      const currentConfigs = mockDb.getConfigurations();
      let savedConfig;
      if (editingConfigId) {
        const idx = currentConfigs.findIndex(c => c.id === editingConfigId);
        if (idx !== -1) {
          currentConfigs[idx] = { ...currentConfigs[idx], ...payload };
          savedConfig = currentConfigs[idx];
        }
      } else {
        savedConfig = {
          id: `config-${Date.now()}`,
          ...payload
        };
        currentConfigs.push(savedConfig);
      }
      mockDb.saveConfigurations(currentConfigs);
      triggerAlert(`Local configuration "${newConfigName}" saved.`);
      setNewConfigName('');
      setNewConfigDesc('');
      setNewConfigParts([]);
      setNewConfigOverhead('500');
      setNewConfigMargin('15');
      setEditingConfigId(null);
      setConfigurations(currentConfigs);
      setSelectedConfig(savedConfig);
      return;
    }

    try {
      let res;
      if (editingConfigId) {
        res = await fetch(`${API_BASE}/configurations/${editingConfigId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/configurations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        const savedConfig = await res.json();
        triggerAlert(`Configuration "${newConfigName}" saved successfully.`);
        // Reset form
        setNewConfigName('');
        setNewConfigDesc('');
        setNewConfigParts([]);
        setNewConfigOverhead('500');
        setNewConfigMargin('15');
        setEditingConfigId(null);
        
        fetchConfigurations();
        setSelectedConfig(savedConfig);
      } else {
        triggerAlert('Error saving configuration.', 'error');
      }
    } catch (err) {
      triggerAlert('Network error.', 'error');
    }
  };

  const handleEditConfigInit = (config) => {
    setNewConfigName(config.name);
    setNewConfigDesc(config.description);
    setNewConfigParts(config.parts);
    setNewConfigOverhead(config.overheadCharges.toString());
    setNewConfigMargin(config.profitMarginPercentage.toString());
    setEditingConfigId(config.id);
  };

  const handleDeleteConfig = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete configuration "${name}"?`)) return;

    if (isOfflineMode) {
      const currentConfigs = mockDb.getConfigurations().filter(c => c.id !== id);
      mockDb.saveConfigurations(currentConfigs);
      setConfigurations(currentConfigs);
      if (selectedConfig && selectedConfig.id === id) {
        setSelectedConfig(null);
      }
      triggerAlert(`Deleted local configuration "${name}".`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/configurations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerAlert(`Deleted configuration "${name}".`);
        if (selectedConfig && selectedConfig.id === id) {
          setSelectedConfig(null);
        }
        fetchConfigurations();
      }
    } catch (err) {
      triggerAlert('Error deleting configuration.', 'error');
    }
  };

  const resetSimulatorOverrides = () => {
    setSimOverheadOverride('');
    setSimMarginOverride('');
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <div className="logo-icon">H</div>
          <div className="logo-text">
            <h1>HERO CYCLES</h1>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Smart Pricing Engine v2.0</span>
              {isOfflineMode && (
                <span className="badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', background: 'rgba(139, 106, 47, 0.15)', color: '#8B6A2F', border: '1px solid #8B6A2F', textTransform: 'uppercase' }}>
                  Offline Mode
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="tab-container" style={{ margin: 0, border: 'none', padding: 0 }}>
          <button 
            className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`} 
            onClick={() => setActiveTab('simulator')}
          >
            Dashboard & Simulator
          </button>
          <button 
            className={`tab-btn ${activeTab === 'parts' ? 'active' : ''}`} 
            onClick={() => setActiveTab('parts')}
          >
            Part Registry
          </button>
          <button 
            className={`tab-btn ${activeTab === 'configs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('configs')}
          >
            Config Builder
          </button>
        </div>
      </header>

      {alert && (
        <div className={`custom-alert ${alert.type === 'error' ? 'error' : ''}`}>
          <span>{alert.type === 'error' ? '⚠️' : '✓'}</span> {alert.message}
        </div>
      )}

      {/* VIEW 1: SIMULATOR & DASHBOARD */}
      {activeTab === 'simulator' && (
        <div className="dashboard-grid">
          {/* Left Column: Configurations Selector */}
          <div className="sidebar">
            <div className="glass-card">
              <div className="card-title">Configurations</div>
              <div className="card-subtitle">Select a bicycle model configuration to analyze and simulate active pricing.</div>
              
              <div className="list-container">
                {configurations.map(config => (
                  <div 
                    key={config.id} 
                    className={`list-item ${selectedConfig?.id === config.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedConfig(config);
                      resetSimulatorOverrides();
                    }}
                  >
                    <div className="list-item-header">
                      <div className="list-item-title">{config.name}</div>
                      <span className="badge badge-purple">{config.parts.length} Parts</span>
                    </div>
                    <div className="list-item-meta" style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      {config.description || 'No description provided.'}
                    </div>
                  </div>
                ))}
                {configurations.length === 0 && (
                  <div className="empty-state">No configurations found.</div>
                )}
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-title">Engine Information</div>
              <div className="card-subtitle" style={{ marginBottom: 0 }}>
                This tool simulates date-effective parts evaluation. Adjust the date slider in the simulator to see historic fluctuations (e.g. steel and tyre pricing increases from January to June 2026).
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Calculator Simulator */}
          <div className="main-content">
            <div className="glass-card simulation-card">
              <div className="card-title">
                <span>Pricing Simulator: {selectedConfig ? selectedConfig.name : 'No Model Selected'}</span>
                {selectedConfig && (
                  <span className="badge badge-blue">Active Base Config</span>
                )}
              </div>

              {selectedConfig ? (
                <>
                  {/* Date Selector and Month Slider */}
                  <div className="date-selector-area">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="form-label" style={{ margin: 0 }}>Date-Effective Target</span>
                      <input 
                        type="date" 
                        className="date-calendar-input"
                        value={simulationDate}
                        onChange={(e) => {
                          setSimulationDate(e.target.value);
                          // Sync slider index if date matches a month start in 2026
                          const monthMatch = MONTHS_2026.find(m => m.dateStr === e.target.value);
                          if (monthMatch) {
                            setSimulationMonth(monthMatch.value);
                          }
                        }}
                      />
                    </div>
                    <div className="date-controls">
                      <div className="slider-container">
                        <input 
                          type="range" 
                          min="0" 
                          max="11" 
                          value={simulationMonth}
                          onChange={(e) => setSimulationMonth(Number(e.target.value))}
                          className="date-slider" 
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 0.25rem' }}>
                          {MONTHS_2026.map(m => (
                            <span 
                              key={m.value} 
                              style={{ 
                                cursor: 'pointer', 
                                color: simulationMonth === m.value ? 'var(--accent-primary)' : 'inherit',
                                fontWeight: simulationMonth === m.value ? '700' : '400'
                              }}
                              onClick={() => setSimulationMonth(m.value)}
                            >
                              {m.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="date-display">
                        {MONTHS_2026.find(m => m.value === Number(simulationMonth))?.label} 2026
                      </div>
                    </div>
                  </div>

                  <div className="calculator-layout">
                    {/* Part List Breakdown Table */}
                    <div className="parts-breakdown">
                      <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Component Parts Cost Resolution
                      </h4>
                      <div style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <table className="breakdown-table">
                          <thead>
                            <tr>
                              <th>Component Name</th>
                              <th>Category</th>
                              <th className="text-right">Cost (INR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculationResult?.parts.map(part => (
                              <tr key={part.id}>
                                <td>{part.name}</td>
                                <td>
                                  <span className={`badge ${
                                    part.category === 'Frame' ? 'badge-blue' :
                                    part.category === 'Tyre' ? 'badge-green' : 'badge-purple'
                                  }`}>{part.category}</span>
                                </td>
                                <td className="text-right currency">₹{part.cost}</td>
                              </tr>
                            ))}
                            {calculationResult?.parts.length === 0 && (
                              <tr>
                                <td colSpan="3" className="empty-state" style={{ padding: '2rem' }}>
                                  No parts registered in this configuration.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Simulation Overrides */}
                      <div className="glass-card" style={{ padding: '1rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Live Pricing Adjustments (Overrides)</span>
                          {(simOverheadOverride !== '' || simMarginOverride !== '') && (
                            <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={resetSimulatorOverrides}>
                              Reset to Base Configs
                            </button>
                          )}
                        </div>
                        <div className="overrides-grid">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Overhead Assembly Charge (₹)</label>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                              placeholder={selectedConfig.overheadCharges.toString()}
                              value={simOverheadOverride}
                              onChange={(e) => setSimOverheadOverride(e.target.value)}
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Profit Margin (%)</label>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                              placeholder={selectedConfig.profitMarginPercentage.toString()}
                              value={simMarginOverride}
                              onChange={(e) => setSimMarginOverride(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Receipt Sheet */}
                    <div>
                      {calculationResult && (
                        <div className="price-receipt-card">
                          <div>
                            <div className="receipt-header">
                              <h3>Invoice Summary</h3>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hero Cycles Pricing Engine</span>
                            </div>

                            <div className="receipt-row">
                              <span>Config Name</span>
                              <span className="bold">{calculationResult.name}</span>
                            </div>
                            <div className="receipt-row">
                              <span>Effective Date</span>
                              <span className="bold">{calculationResult.date}</span>
                            </div>
                            <div className="receipt-row">
                              <span>Sum of Parts</span>
                              <span className="currency bold">₹{calculationResult.partsCost}</span>
                            </div>
                            <div className="receipt-row">
                              <span>Assembly / Labor</span>
                              <span className="currency bold">₹{calculationResult.overheadCharges}</span>
                            </div>

                            <div className="receipt-row bold" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                              <span>Subtotal</span>
                              <span className="currency">₹{calculationResult.subtotal}</span>
                            </div>

                            <div className="receipt-row">
                              <span>Profit Margin ({calculationResult.profitMarginPercentage}%)</span>
                              <span className="currency bold">₹{calculationResult.marginAmount}</span>
                            </div>

                            <div className="receipt-row">
                              <span>Pre-tax Total</span>
                              <span className="currency bold">₹{calculationResult.preTaxTotal}</span>
                            </div>

                            <div className="receipt-row">
                              <span>GST Tax ({calculationResult.taxPercentage}%)</span>
                              <span className="currency bold">₹{calculationResult.taxAmount}</span>
                            </div>
                          </div>

                          <div className="receipt-total-divider">
                            <div className="receipt-total-row">
                              <span className="receipt-total-label">Final Dealer Price</span>
                              <span className="receipt-total-amount">₹{calculationResult.finalTotal}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🚴</div>
                  <p>Please select or create a cycle configuration model to start pricing simulation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PART REGISTRY MANAGEMENT */}
      {activeTab === 'parts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem' }}>
          {/* Add & Edit Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Create Part Form */}
            <div className="glass-card">
              <div className="card-title">Add New Part</div>
              <form onSubmit={handleAddPart}>
                <div className="form-group">
                  <label className="form-label">Part Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Shimano 9-Speed Rear Derailleur" 
                    value={newPartName} 
                    onChange={e => setNewPartName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select" 
                    value={newPartCategory} 
                    onChange={e => setNewPartCategory(e.target.value)}
                  >
                    <option value="Frame">Frame</option>
                    <option value="Gear">Gear Set</option>
                    <option value="Tyre">Tyre</option>
                    <option value="Brake">Brake Set</option>
                    <option value="Saddle">Saddle / Seat</option>
                    <option value="Handlebar">Handlebar</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Cost (INR)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g. 1500" 
                    value={newPartCost} 
                    onChange={e => setNewPartCost(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Effective Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newPartDate} 
                    onChange={e => setNewPartDate(e.target.value)} 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Register Component
                </button>
              </form>
            </div>

            {/* Set price change for existing part */}
            {selectedPartForPrice ? (
              <div className="glass-card" style={{ borderColor: 'var(--accent-primary)' }}>
                <div className="card-title">
                  <span>Add Cost Entry</span>
                  <button className="btn btn-secondary" style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }} onClick={() => setSelectedPartForPrice(null)}>
                    Cancel
                  </button>
                </div>
                <div className="card-subtitle">
                  Modify pricing for: <strong>{selectedPartForPrice.name}</strong>
                </div>
                <form onSubmit={handleAddPriceChange}>
                  <div className="form-group">
                    <label className="form-label">New Cost (INR)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 1700" 
                      value={newPriceCost} 
                      onChange={e => setNewPriceCost(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Effective Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={newPriceDate} 
                      onChange={e => setNewPriceDate(e.target.value)} 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    Save Price Point
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass-card">
                <div className="card-title">Update Cost Entry</div>
                <div className="card-subtitle" style={{ marginBottom: 0 }}>
                  Click the <strong>Add Cost</strong> button on any part in the table to record a price change over time.
                </div>
              </div>
            )}
          </div>

          {/* Parts List Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="card-title">Component Registry</div>
            <div className="card-subtitle">Registered bicycle components, showing active price history.</div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Component Name</th>
                    <th>Category</th>
                    <th>Price History timeline</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map(part => (
                    <tr key={part.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{part.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {part.id}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          part.category === 'Frame' ? 'badge-blue' :
                          part.category === 'Tyre' ? 'badge-green' : 'badge-purple'
                        }`}>{part.category}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {part.priceHistory.map((h, i) => (
                            <span 
                              key={i} 
                              className="badge" 
                              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
                              title={`Effective ${h.date}`}
                            >
                              {h.date.substring(5)}: <strong>₹{h.cost}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-right">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', textTransform: 'none' }}
                            onClick={() => {
                              setSelectedPartForPrice(part);
                              setNewPriceCost('');
                            }}
                          >
                            Add Cost
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', textTransform: 'none' }}
                            onClick={() => handleDeletePart(part.id, part.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {parts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-state">No parts registered. Please add a part on the left.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CONFIGURATION BUILDER */}
      {activeTab === 'configs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '450px 1fr', gap: '2rem' }}>
          {/* Builder Form */}
          <div className="glass-card">
            <div className="card-title">
              <span>{editingConfigId ? 'Edit Configuration' : 'Create Cycle Configuration'}</span>
              {editingConfigId && (
                <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => {
                  setEditingConfigId(null);
                  setNewConfigName('');
                  setNewConfigDesc('');
                  setNewConfigParts([]);
                }}>
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleSaveConfig}>
              <div className="form-group">
                <label className="form-label">Configuration Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Hero Ranger X2" 
                  value={newConfigName}
                  onChange={e => setNewConfigName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Summarize the cycle build..." 
                  value={newConfigDesc}
                  onChange={e => setNewConfigDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Components included in this Build</label>
                <div className="parts-selector-grid">
                  {parts.map(part => {
                    const isSelected = newConfigParts.includes(part.id);
                    return (
                      <label 
                        key={part.id} 
                        className={`part-checkbox-label ${isSelected ? 'selected' : ''}`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleConfigPartSelection(part.id)}
                          style={{ display: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{part.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{part.category}</span>
                        </div>
                      </label>
                    );
                  })}
                  {parts.length === 0 && (
                    <div style={{ padding: '1rem', color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center' }}>
                      Register parts in the Part Registry first.
                    </div>
                  )}
                </div>
              </div>

              <div className="overrides-grid" style={{ marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Base Overhead Assembly (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newConfigOverhead}
                    onChange={e => setNewConfigOverhead(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Base Margin Percentage (%)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newConfigMargin}
                    onChange={e => setNewConfigMargin(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {editingConfigId ? 'Update Configuration' : 'Assemble Configuration'}
              </button>
            </form>
          </div>

          {/* Active Configurations List */}
          <div className="glass-card" style={{ height: 'fit-content' }}>
            <div className="card-title">Existing Models</div>
            <div className="card-subtitle">Select a configuration to edit details or delete from system.</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {configurations.map(config => (
                <div key={config.id} className="list-item" style={{ cursor: 'default' }}>
                  <div className="list-item-header">
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{config.name}</span>
                    <span className="badge badge-blue">{config.parts.length} parts</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                    {config.description || 'No description.'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    <div>Assembly: <strong>₹{config.overheadCharges}</strong></div>
                    <div>Margin: <strong>{config.profitMarginPercentage}%</strong></div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', width: '100%' }}
                      onClick={() => handleEditConfigInit(config)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', width: '100%' }}
                      onClick={() => handleDeleteConfig(config.id, config.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {configurations.length === 0 && (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  No cycle models configured yet. Create one using the form.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
