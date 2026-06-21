const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

function readDb() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

function getActiveCost(part, targetDateStr) {
  if (!part.priceHistory || part.priceHistory.length === 0) {
    return 0;
  }
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

function calculatePricing(configId, targetDateStr, db) {
  const targetConfig = db.configurations.find(c => c.id === configId);
  if (!targetConfig) {
    throw new Error('Config not found');
  }

  const parts = targetConfig.parts;
  let partsCostTotal = 0;
  const breakdown = [];

  for (const partId of parts) {
    const part = db.parts.find(p => p.id === partId);
    if (part) {
      const activeCost = getActiveCost(part, targetDateStr);
      breakdown.push({ name: part.name, cost: activeCost });
      partsCostTotal += activeCost;
    }
  }

  const subtotal = partsCostTotal + targetConfig.overheadCharges;
  const marginAmount = Number((subtotal * (targetConfig.profitMarginPercentage / 100)).toFixed(2));
  const preTaxTotal = subtotal + marginAmount;
  const taxPercentage = 18;
  const taxAmount = Number((preTaxTotal * (taxPercentage / 100)).toFixed(2));
  const finalTotal = Number((preTaxTotal + taxAmount).toFixed(2));

  return {
    partsCostTotal,
    subtotal,
    marginAmount,
    taxAmount,
    finalTotal,
    breakdown
  };
}

// Running Tests
function runTests() {
  console.log('--- RUNNING PRICING ENGINE TESTS ---');
  const db = readDb();

  // Test 1: Ranger config on 2026-01-01
  // Parts in Ranger:
  // - Frame Steel: 1200
  // - Single Speed: 350
  // - Standard Road Tyre: 400
  // - Caliper Brakes: 250
  // - Comfort Saddle: 300
  // - Straight Handlebar: 200
  // Total parts cost = 1200 + 350 + 400 + 250 + 300 + 200 = 2700
  // Overhead = 350
  // Subtotal = 3050
  // Margin = 12% -> 3050 * 0.12 = 366
  // Pre-tax total = 3416
  // Tax = 18% -> 3416 * 0.18 = 614.88
  // Final total = 4030.88
  
  const janResult = calculatePricing('config-ranger', '2026-01-15', db);
  console.assert(janResult.partsCostTotal === 2700, `Expected 2700 parts cost, got ${janResult.partsCostTotal}`);
  console.assert(janResult.finalTotal === 4030.88, `Expected 4030.88 total, got ${janResult.finalTotal}`);
  console.log('✓ Test 1 Passed: Hero Ranger pricing in January matches expected values.');

  // Test 2: Ranger config on 2026-06-15 (after tyre cost increases to 480 and steel frame increases to 1350)
  // Parts in Ranger:
  // - Frame Steel: 1350 (since June 1)
  // - Single Speed: 350
  // - Standard Road Tyre: 480 (since June 1)
  // - Caliper Brakes: 250
  // - Comfort Saddle: 300
  // - Straight Handlebar: 200
  // Total parts cost = 1350 + 350 + 480 + 250 + 300 + 200 = 2930 (increase of 230)
  // Overhead = 350
  // Subtotal = 3280
  // Margin = 12% -> 3280 * 0.12 = 393.6
  // Pre-tax total = 3673.6
  // Tax = 18% -> 3673.6 * 0.18 = 661.25 (approx)
  // Final total = 3673.6 + 661.25 = 4334.85
  
  const juneResult = calculatePricing('config-ranger', '2026-06-15', db);
  console.assert(juneResult.partsCostTotal === 2930, `Expected 2930 parts cost, got ${juneResult.partsCostTotal}`);
  console.assert(juneResult.finalTotal === 4334.85, `Expected 4334.85 total, got ${juneResult.finalTotal}`);
  console.log('✓ Test 2 Passed: Hero Ranger pricing in June correctly resolves increased component costs.');

  console.log('--- ALL TESTS PASSED SUCCESSFULLY ---');
}

runTests();
