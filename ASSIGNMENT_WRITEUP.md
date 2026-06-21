# Hero Cycles Pricing Engine - Assignment Writeup

This document outlines the problem breakdown, assumptions made, pricing engine pseudocode, and AI prompts used during the design and implementation of the solution.

---

## Part 1 — Problem Breakdown

### Questions Thought Of While Solving
1. **How do we handle price fluctuations over time?**
   - *Problem:* A part cost changes month-to-month. If we calculate the price of a cycle configuration, does it reflect *current* costs or the cost at the time of manufacture?
   - *Resolution:* We modeled each component with a `priceHistory` array containing timestamped cost entries. The pricing engine resolves the cost of each part dynamically by finding the latest price entry that is `date <= targetDate`.
2. **What factors are included in the pricing calculations?**
   - *Problem:* Does the cycle's final price only include parts, or are assembly labor and profit margins included?
   - *Resolution:* A standard manufacturing formula is used:
     $$\text{Subtotal} = \text{Sum of Part Costs} + \text{Assembly Overhead}$$
     $$\text{Pre-tax Price} = \text{Subtotal} + (\text{Subtotal} \times \text{Profit Margin Percentage})$$
     $$\text{Final Price} = \text{Pre-tax Price} + (\text{Pre-tax Price} \times \text{GST 18\%})$$
3. **How to support custom combinations (Sandbox pricing)?**
   - *Problem:* What if a customer requests a standard frame but swaps the standard tyres for high-performance tubeless tyres?
   - *Resolution:* The calculation endpoint supports a list of custom part IDs so salespersons can run sandbox scenarios.
4. **How do we ensure zero-friction installation?**
   - *Problem:* Setting up PostgreSQL, MySQL, or MongoDB would require database installation and environment configuration for the interviewer.
   - *Resolution:* We chose a flat-file JSON database (`db.json`) pre-populated with data. It supports read/write persistence and runs instantly with no setup.

### Assumptions Made
1. **Date format:** All dates are stored and compared in `YYYY-MM-DD` ISO format, allowing simple lexicographical comparison.
2. **Taxation:** GST (Goods and Services Tax) is assumed to be a standard 18% for all cycle types.
3. **Effective Date Fallback:** If a query date is before the earliest recorded price entry of a part, the pricing engine falls back to the oldest price record rather than returning 0.
4. **Roles:** Salespersons need an interactive slider to demonstrate price changes instantly, and database operators need forms to modify component registries in the same client app.

---

## Part 2 — Conceptual Solution & Pseudocode

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────┐
│                        VITE + REACT                    │
│  - Dashboard & Simulator (Month Slider, Receipt UI)   │
│  - Part Registry (Registry tables, Price entries)      │
│  - Config Builder (Select components, Overhead input)  │
└───────────────────────────┬────────────────────────────┘
                            │ (REST APIs)
                            ▼
┌────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND                   │
│  - GET /api/calculate (Resolves date-effective cost)   │
│  - CRUD /api/parts & /api/configurations               │
└───────────────────────────┬────────────────────────────┘
                            │ (File Read/Write)
                            ▼
┌────────────────────────────────────────────────────────┐
│                      LOCAL JSON DB                     │
│  - db.json (Tracks part schema & cost histories)       │
└────────────────────────────────────────────────────────┘
```

### Pricing Resolution Pseudocode
```python
FUNCTION get_active_cost(part, target_date):
    # Sort price history chronological ascending
    sorted_history = sort(part.priceHistory, key=lambda x: x.date)
    
    # Initialize with the oldest price
    active_cost = sorted_history[0].cost
    
    # Scan history for the latest price entry before or on target_date
    for entry in sorted_history:
        if entry.date <= target_date:
            active_cost = entry.cost
        else:
            break
            
    return active_cost


FUNCTION calculate_pricing(config_id, query_date, db):
    config = db.configurations.find(config_id)
    if not config:
        return ERROR "Configuration not found"
        
    parts_cost = 0
    resolved_parts_breakdown = []
    
    # Resolve active costs for each part
    for part_id in config.parts:
        part = db.parts.find(part_id)
        if part:
            active_cost = get_active_cost(part, query_date)
            resolved_parts_breakdown.append({
                "id": part.id,
                "name": part.name,
                "cost": active_cost
            })
            parts_cost += active_cost
            
    # Calculate margins and taxes
    subtotal = parts_cost + config.overheadCharges
    margin_amount = subtotal * (config.profitMarginPercentage / 100)
    pre_tax_total = subtotal + margin_amount
    tax_percentage = 18
    tax_amount = pre_tax_total * (tax_percentage / 100)
    final_total = pre_tax_total + tax_amount
    
    return {
        "parts_cost": parts_cost,
        "overhead": config.overheadCharges,
        "subtotal": subtotal,
        "margin_amount": margin_amount,
        "pre_tax_total": pre_tax_total,
        "tax_amount": tax_amount,
        "final_total": final_total,
        "parts": resolved_parts_breakdown
    }
```

---

## Part 3 — AI Prompts Used

The following AI prompts and design iterations were used during brainstorming, architecture formulation, and code generation:

### UI Direction — First Pass (Rejected)
An earlier design pass produced a dark-mode "cyber dashboard" with glassmorphism — backdrop blur, glowing accents, and dark slate cards. This was explicitly rejected as too generic and templated ("the one [the other tool] did is too cliche") before backend implementation.

### UI Direction — Revised (Warm Industrial Spec-Sheet)
*User Prompt:*
> *"I want prompt about the UI/UX of the application. The colour palette should be different... I want unique UI, with very different colour palette (light mode)."*

Claude proposed grounding the design in the actual subject — a tactile parts-catalog / spec-sheet aesthetic for a salesperson's desk tool, rather than a generic SaaS dashboard. We worked through a token system before styling:
- **Warm Industrial Light-Mode Palette**: Bone (`#F2EEE3`), Ink-Pine (`#1F2A24`), Rust (`#C4501C`), Brass (`#8B6A2F`), and Moss (`#5C6B5D`).
- **Typography**: Outfit for display headers, paired with JetBrains Mono for prices, part numbers, and invoices.
- **Layout**: A two-column build-sheet structure with a sticky printed paper receipt panel.

### Prompts Log
1. **Brainstorming and Architecture:**
   > *"Analyze the Hero Cycles pricing engine requirements. We need a system where part costs fluctuate month-to-month. How should we structure the database schema to support time-varying prices? Recommend a lightweight architecture that requires zero database setup on the reviewer's side."*

2. **Industrial Design System & CSS:**
   > *"Generate a custom CSS design system using Vanilla CSS variables. The theme should be a warm industrial light-mode parts-catalog design system using bone (#F2EEE3) as background, deep ink-pine (#1F2A24) for text/headers, burnt rust/safety-orange (#C4501C) as primary accent, moss steel (#5C6B5D) for secondary labels and borders, and brass (#8B6A2F) for prices and change indicator emphasis. Styled cards should use aged tan (#E8DCC4) and invoice receipts should resemble off-white printed cargo sheets."*

3. **Pricing Logic & Node/Express Setup:**
   > *"Write an Express server that uses a JSON file for data persistence. Implement a date-effective pricing calculator endpoint. Given a date, it should retrieve the correct prices for components on that specific date (latest date <= target date). Include CRUD endpoints for managing parts and configurations."*

4. **React Dashboard Implementation:**
   > *"Write a React application (`App.jsx`) connecting to this Express API. The layout should have a grid with a list of configurations on the left, and a simulator on the right. The simulator should have a month range slider and a date picker, which triggers real-time price updates. Add tabs to manage parts and configure cycles."*
