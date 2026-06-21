# Hero Cycles Pricing Engine - Submission

A full-stack pricing engine application built for Hero Cycles. This system replaces legacy Excel pricing sheets with a date-effective pricing calculator that handles time-varying component costs (e.g. tyre or frame prices that increase over months), allows CRUD management of parts and configurations, and generates detailed invoice summaries.

## Features
1. **Interactive Pricing Dashboard & Simulator**: Select a cycle configuration and drag the month slider to watch costs automatically resolve and recalculate.
2. **Dynamic Live Overrides**: Instantly test pricing scenarios by tweaking the assembly overhead or profit margin inside the simulator.
3. **Interactive Invoice Receipt**: Clean invoice breakdown showing sum of parts, assembly cost, subtotal, profit margin amount, GST (18%), and final dealer price.
4. **Part Registry**: Full CRUD interface for adding parts, deleting parts, and scheduling future/past price adjustments.
5. **Config Builder**: Interactive build manager with checkbox selections of components, custom overhead inputs, and target margin configurations.

---

## Installation & Setup

### Prerequisites
- **Node.js** (v16.0.0 or higher recommended)
- **npm** (comes packaged with Node.js)

### Quick Start (One Command Setup)
Run the setup command from the project root to install dependencies in both the backend and frontend:

```bash
npm run setup
```

### Running the System
Start both the backend API and frontend Vite server concurrently with a single command from the project root:

```bash
npm start
```

- **Frontend client** will run at: [http://localhost:5173/](http://localhost:5173/)
- **Backend server** will run at: [http://localhost:5000/](http://localhost:5000/)

---

## Testing

We have built automated unit tests to verify the date-effective pricing resolution engine. 

To run the backend tests:
1. Navigate to the `backend/` directory.
2. Run the test script:
```bash
cd backend
npm test
```

The test runner will verify:
- Correct component cost resolution on `2026-01-15` (e.g., Hero Ranger costing ₹4030.88 total).
- Correct component cost resolution on `2026-06-15` (reflecting the price updates in steel frames and tyres, costing ₹4334.85 total).

---

## Technical Stack
- **Frontend**: React, Vite, custom Vanilla CSS variables for glassmorphism styling.
- **Backend**: Node.js, Express.
- **Database**: Flat-file JSON database (`db.json`) for persistence with zero external database dependencies.
