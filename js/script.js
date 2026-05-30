/* ============================================
   HERMAN SUPPLY CHAIN SOLUTIONS
   Version 1.1 — With Supabase Integration
   ============================================ */

// ---- SUPABASE CONFIG ----
const SUPABASE_URL = https://bkfsjhhclbqrhaolvhmz.supabase.co'';   // e.g. https://bkfsjhhclbqrhaolvhmz.supabase.co
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZnNqaGhjbGJxcmhhb2x2aG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTQwNzksImV4cCI6MjA5NTczMDA3OX0.CSO6htrFeFYr93yOBo2iFK4Ul-QcoiGKIG4rAJxv6kY';      // the long eyJ... key

async function supabaseInsert(table, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  return response;
}

// ---- NAVIGATION ----
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ---- ASSESSMENT CALCULATOR ----
function calculateAssessment(data) {
  const {
    routes, stops, weeklyMiles, weeklyRevenue,
    weeklyTransportCost, weeklyLaborCost,
    onTimePct, completionPct, csat,
    drivers, trucks
  } = data;

  const costPerRoute = routes > 0 ? (weeklyTransportCost + weeklyLaborCost) / routes : 0;
  const costPerStop = stops > 0 ? (weeklyTransportCost + weeklyLaborCost) / stops : 0;
  const revenuePerStop = stops > 0 ? weeklyRevenue / stops : 0;
  const transportPct = weeklyRevenue > 0 ? (weeklyTransportCost / weeklyRevenue) * 100 : 0;
  const laborPct = weeklyRevenue > 0 ? (weeklyLaborCost / weeklyRevenue) * 100 : 0;
  const totalCostPct = transportPct + laborPct;
  const stopsPerRoute = routes > 0 ? stops / routes : 0;
  const milesPerRoute = routes > 0 ? weeklyMiles / routes : 0;
  const revenuePerDriver = drivers > 0 ? weeklyRevenue / drivers : 0;

  let score = 100;
  if (onTimePct < 95) score -= Math.min(25, (95 - onTimePct) * 1.5);
  if (completionPct < 98) score -= Math.min(20, (98 - completionPct) * 2);
  if (csat < 4.5) score -= Math.min(15, (4.5 - csat) * 10);
  if (transportPct > 20) score -= Math.min(20, (transportPct - 20) * 1.2);
  if (laborPct > 25) score -= Math.min(15, (laborPct - 25) * 0.8);
  if (totalCostPct > 40) score -= Math.min(5, (totalCostPct - 40) * 0.3);
  score = Math.max(0, Math.min(100, Math.round(score)));

  let grade;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  let riskLevel;
  if (score >= 80 && totalCostPct < 40) riskLevel = 'Low';
  else if (score >= 65 || totalCostPct < 50) riskLevel = 'Medium';
  else riskLevel = 'High';

  const targetTransportCost = weeklyRevenue * 0.18;
  const targetLaborCost = weeklyRevenue * 0.22;
  const currentTotalCost = weeklyTransportCost + weeklyLaborCost;
  const targetTotalCost = targetTransportCost + targetLaborCost;
  const weeklySavings = Math.max(0, currentTotalCost - targetTotalCost);
  const annualSavings = weeklySavings * 52;

  const risks = [];
  if (onTimePct < 90) risks.push({ level: 'HIGH', text: `On-time delivery at ${onTimePct}% — critically below industry benchmark of 95%. Immediate route audit required.` });
  else if (onTimePct < 95) risks.push({ level: 'MEDIUM', text: `On-time delivery at ${onTimePct}% — below 95% benchmark. Routing optimization recommended.` });
  if (completionPct < 95) risks.push({ level: 'HIGH', text: `Route completion at ${completionPct}% indicates significant operational breakdown and revenue leakage.` });
  else if (completionPct < 98) risks.push({ level: 'MEDIUM', text: `Completion rate of ${completionPct}% suggests driver capacity or scheduling issues.` });
  if (transportPct > 25) risks.push({ level: 'HIGH', text: `Transportation cost at ${transportPct.toFixed(1)}% of revenue exceeds sustainable threshold of 20%.` });
  else if (transportPct > 20) risks.push({ level: 'MEDIUM', text: `Transportation cost at ${transportPct.toFixed(1)}% of revenue approaching the 20% danger threshold.` });
  if (laborPct > 30) risks.push({ level: 'HIGH', text: `Labor cost at ${laborPct.toFixed(1)}% of revenue is critically high.` });
  else if (laborPct > 25) risks.push({ level: 'MEDIUM', text: `Labor at ${laborPct.toFixed(1)}% of revenue is above optimal range.` });
  if (csat < 4.0) risks.push({ level: 'HIGH', text: `Customer satisfaction at ${csat}/5.0 signals serious service delivery failures.` });
  else if (csat < 4.5) risks.push({ level: 'MEDIUM', text: `CSAT score of ${csat}/5.0 is below the 4.5 excellence benchmark.` });
  if (stopsPerRoute < 8) risks.push({ level: 'MEDIUM', text: `Low stop density (${stopsPerRoute.toFixed(1)} stops/route) indicates underloaded routes.` });
  if (risks.length < 3) {
    risks.push({ level: 'LOW', text: 'Establish monthly KPI review cadence to maintain operational excellence.' });
    risks.push({ level: 'LOW', text: 'Consider real-time GPS tracking and dynamic route adjustment.' });
  }

  const actions = [];
  if (transportPct > 20) actions.push('Commission a full transportation cost audit to identify fuel, toll, and carrier contract savings.');
  if (onTimePct < 95) actions.push('Implement dynamic route optimization software to improve on-time performance.');
  if (completionPct < 98) actions.push('Analyze incomplete route patterns to identify capacity or scheduling issues.');
  if (laborPct > 25) actions.push('Conduct driver schedule optimization to reduce overtime and align hours with demand.');
  if (csat < 4.5) actions.push('Deploy customer ETA notifications to improve satisfaction scores.');
  if (stopsPerRoute < 10) actions.push('Perform route density analysis to consolidate underloaded routes.');
  actions.push('Build a real-time KPI command center dashboard to monitor performance daily.');
  actions.push('Establish a quarterly operational assessment cadence.');
  actions.push('Evaluate contractor vs. employee driver mix to optimize labor cost structure.');
  actions.push('Implement revenue recovery audits to identify unbilled stops and missed billing opportunities.');

  return {
    ...data,
    costPerRoute: costPerRoute.toFixed(2),
    costPerStop: costPerStop.toFixed(2),
    revenuePerStop: revenuePerStop.toFixed(2),
    transportPct: transportPct.toFixed(1),
    laborPct: laborPct.toFixed(1),
    totalCostPct: totalCostPct.toFixed(1),
    stopsPerRoute: stopsPerRoute.toFixed(1),
    milesPerRoute: milesPerRoute.toFixed(0),
    revenuePerDriver: revenuePerDriver.toFixed(0),
    weeklySavings: weeklySavings.toFixed(0),
    annualSavings: annualSavings.toFixed(0),
    efficiencyScore: score,
    grade,
    riskLevel,
    risks: risks.slice(0, 5),
    actions: actions.slice(0, 5),
    reportDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
}

// ---- ASSESSMENT FORM HANDLER ----
async function initAssessmentForm() {
  const form = document.getElementById('assessmentForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Calculating...';
    btn.disabled = true;

    const data = {
      companyName: document.getElementById('companyName').value.trim(),
      industry: document.getElementById('industry').value,
      drivers: parseFloat(document.getElementById('drivers').value) || 0,
      trucks: parseFloat(document.getElementById('trucks').value) || 0,
      routes: parseFloat(document.getElementById('routes').value) || 0,
      stops: parseFloat(document.getElementById('stops').value) || 0,
      weeklyMiles: parseFloat(document.getElementById('weeklyMiles').value) || 0,
      weeklyRevenue: parseFloat(document.getElementById('weeklyRevenue').value) || 0,
      weeklyTransportCost: parseFloat(document.getElementById('weeklyTransportCost').value) || 0,
      weeklyLaborCost: parseFloat(document.getElementById('weeklyLaborCost').value) || 0,
      onTimePct: parseFloat(document.getElementById('onTimePct').value) || 0,
      completionPct: parseFloat(document.getElementById('completionPct').value) || 0,
      csat: parseFloat(document.getElementById('csat').value) || 0,
    };

    if (!data.companyName) { alert('Please enter your company name.'); btn.textContent = 'Calculate My Assessment →'; btn.disabled = false; return; }
    if (data.weeklyRevenue <= 0) { alert('Please enter your weekly revenue.'); btn.textContent = 'Calculate My Assessment →'; btn.disabled = false; return; }

    const results = calculateAssessment(data);

    // Save to Supabase
    await supabaseInsert('assessment_results', {
      company_name: results.companyName,
      industry: results.industry,
      drivers: results.drivers,
      trucks: results.trucks,
      routes_per_day: results.routes,
      stops_per_day: results.stops,
      weekly_miles: results.weeklyMiles,
      weekly_revenue: results.weeklyRevenue,
      weekly_transport_cost: results.weeklyTransportCost,
      weekly_labor_cost: results.weeklyLaborCost,
      on_time_pct: results.onTimePct,
      completion_pct: results.completionPct,
      csat: results.csat,
      cost_per_route: parseFloat(results.costPerRoute),
      cost_per_stop: parseFloat(results.costPerStop),
      revenue_per_stop: parseFloat(results.revenuePerStop),
      transport_pct: parseFloat(results.transportPct),
      labor_pct: parseFloat(results.laborPct),
      total_cost_pct: parseFloat(results.totalCostPct),
      efficiency_score: results.efficiencyScore,
      grade: results.grade,
      risk_level: results.riskLevel,
      annual_savings: parseFloat(results.annualSavings)
    });

    // Save to localStorage for results page
    localStorage.setItem('hsc_assessment', JSON.stringify(results));
    window.location.href = 'results.html';
  });
}

// ---- RESULTS PAGE RENDERER ----
function initResults() {
  const container = document.getElementById('resultsContainer');
  if (!container) return;

  const raw = localStorage.getItem('hsc_assessment');
  if (!raw) {
    container.innerHTML = `
      <div style="text-align:center; padding: 80px 32px;">
        <h2 style="font-family: var(--font-display); font-size:1.8rem; color:var(--navy); margin-bottom:16px;">No Assessment Data Found</h2>
        <p style="color:var(--gray-500); margin-bottom:32px;">Please complete the operational assessment first.</p>
        <a href="assessment.html" class="btn btn-primary">Take the Assessment</a>
      </div>`;
    return;
  }

  const r = JSON.parse(raw);

  function fmtDollar(n) { return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }); }
  function fmtPct(n) { return n + '%'; }
  function indicator(value, goodThreshold, warnThreshold, higher = true) {
    if (higher) {
      if (value >= goodThreshold) return 'ind-green';
      if (value >= warnThreshold) return 'ind-yellow';
      return 'ind-red';
    } else {
      if (value <= goodThreshold) return 'ind-green';
      if (value <= warnThreshold) return 'ind-yellow';
      return 'ind-red';
    }
  }

  const gradeClass = `grade-${r.grade.toLowerCase()}`;
  const riskColor = r.riskLevel === 'Low' ? '#25A865' : r.riskLevel === 'Medium' ? '#C9A84C' : '#FF6B6B';
  const riskBadgeClass = { 'HIGH': 'risk-high', 'MEDIUM': 'risk-medium', 'LOW': 'risk-low' };

  const risksHTML = r.risks.map(risk => `
    <div class="risk-item">
      <span class="risk-badge ${riskBadgeClass[risk.level] || 'risk-low'}">${risk.level}</span>
      <span class="risk-text">${risk.text}</span>
    </div>`).join('');

  const actionsHTML = r.actions.map((action, i) => `
    <div class="action-item">
      <div class="action-num">${i + 1}</div>
      <span class="action-text">${action}</span>
    </div>`).join('');

  container.innerHTML = `
    <div class="results-header">
      <div class="results-company">
        <h2>${r.companyName}</h2>
        <p>${r.industry} &nbsp;·&nbsp; Assessment Date: ${r.reportDate}</p>
        <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">
          <span class="hero-stat-badge" style="background:rgba(${r.riskLevel==='Low'?'37,168,101':'Medium'===r.riskLevel?'201,168,76':'255,107,107'},0.2); color:${riskColor}; font-family:var(--font-mono); font-size:0.65rem; padding:4px 12px; border-radius:100px;">
            ${r.riskLevel} Risk
          </span>
          <span class="hero-stat-badge badge-blue">Efficiency Score: ${r.efficiencyScore}/100</span>
        </div>
      </div>
      <div class="results-grade-wrap">
        <div class="results-grade ${gradeClass}">${r.grade}</div>
        <div class="results-grade-label">Operational Grade</div>
      </div>
    </div>

    <div class="results-grid">
      <div class="results-metric">
        <div class="results-indicator ${indicator(parseFloat(r.transportPct), 20, 25, false)}"></div>
        <div class="results-metric-label">Transport Cost %</div>
        <div class="results-metric-value">${fmtPct(r.transportPct)}</div>
        <div style="font-size:0.75rem; color:var(--gray-400);">Target: &lt;20%</div>
      </div>
      <div class="results-metric">
        <div class="results-indicator ${indicator(parseFloat(r.laborPct), 25, 30, false)}"></div>
        <div class="results-metric-label">Labor Cost %</div>
        <div class="results-metric-value">${fmtPct(r.laborPct)}</div>
        <div style="font-size:0.75rem; color:var(--gray-400);">Target: &lt;25%</div>
      </div>
      <div class="results-metric">
        <div class="results-indicator ${indicator(r.onTimePct, 95, 90)}"></div>
        <div class="results-metric-label">On-Time Rate</div>
        <div class="results-metric-value">${fmtPct(r.onTimePct)}</div>
        <div style="font-size:0.75rem; color:var(--gray-400);">Target: &gt;95%</div>
      </div>
      <div class="results-metric">
        <div class="results-indicator ${indicator(r.completionPct, 98, 95)}"></div>
        <div class="results-metric-label">Completion Rate</div>
        <div class="results-metric-value">${fmtPct(r.completionPct)}</div>
        <div style="font-size:0.75rem; color:var(--gray-400);">Target: &gt;98%</div>
      </div>
    </div>

    <div class="results-grid" style="margin-bottom:32px;">
      <div class="results-metric">
        <div class="results-metric-label">Cost Per Route</div>
        <div class="results-metric-value">${fmtDollar(r.costPerRoute)}</div>
      </div>
      <div class="results-metric">
        <div class="results-metric-label">Cost Per Stop</div>
        <div class="results-metric-value">${fmtDollar(r.costPerStop)}</div>
      </div>
      <div class="results-metric">
        <div class="results-metric-label">Revenue Per Stop</div>
        <div class="results-metric-value">${fmtDollar(r.revenuePerStop)}</div>
      </div>
      <div class="results-metric">
        <div class="results-indicator ${indicator(parseFloat(r.csat), 4.5, 4.0)}"></div>
        <div class="results-metric-label">CSAT Score</div>
        <div class="results-metric-value">${r.csat} / 5</div>
        <div style="font-size:0.75rem; color:var(--gray-400);">Target: &gt;4.5</div>
      </div>
    </div>

    <div class="savings-banner">
      <div>
        <h3>Estimated Annual Savings Opportunity</h3>
        <div class="savings-amount">${fmtDollar(r.annualSavings)}</div>
        <div class="savings-sub">Based on industry benchmarks for your operational profile</div>
      </div>
      <div style="min-width:260px;">
        <div class="efficiency-bar">
          <div class="efficiency-bar-label">
            <span>Efficiency Score</span>
            <span>${r.efficiencyScore}/100</span>
          </div>
          <div class="efficiency-bar-track">
            <div class="efficiency-bar-fill" style="width:${r.efficiencyScore}%"></div>
          </div>
        </div>
        <div style="margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.8rem; color:rgba(255,255,255,0.55);">
          <div>Stops/Route: <span style="color:var(--white);">${r.stopsPerRoute}</span></div>
          <div>Miles/Route: <span style="color:var(--white);">${r.milesPerRoute}</span></div>
          <div>Rev/Driver: <span style="color:var(--white);">${fmtDollar(r.revenuePerDriver)}</span></div>
          <div>Total Cost %: <span style="color:var(--white);">${r.totalCostPct}%</span></div>
        </div>
      </div>
    </div>

    <div class="results-two-col">
      <div class="results-panel">
        <h3>⚠ Top Operational Risks</h3>
        ${risksHTML}
      </div>
      <div class="results-panel">
        <h3>✅ Recommended Actions</h3>
        ${actionsHTML}
      </div>
    </div>

    <div class="results-panel" style="margin-bottom:32px;">
      <h3>Executive Summary</h3>
      <p style="font-size:0.925rem; color:var(--gray-700); line-height:1.8; margin-bottom:16px;">
        <strong>${r.companyName}</strong> received an operational grade of <strong>${r.grade}</strong>
        with an efficiency score of <strong>${r.efficiencyScore}/100</strong>, placing the organization in the
        <strong>${r.riskLevel} Risk</strong> category. The assessment evaluated ${r.drivers} drivers,
        ${r.routes} daily routes, ${r.stops} daily stops, and ${Number(r.weeklyMiles).toLocaleString()} weekly miles.
      </p>
      <p style="font-size:0.925rem; color:var(--gray-700); line-height:1.8; margin-bottom:16px;">
        Current transportation costs represent <strong>${r.transportPct}%</strong> of weekly revenue,
        while labor costs account for <strong>${r.laborPct}%</strong> — totaling
        <strong>${r.totalCostPct}%</strong> of revenue consumed by core operational expenses.
        Industry best-in-class operators target a combined ratio below 40%.
      </p>
      <p style="font-size:0.925rem; color:var(--gray-700); line-height:1.8;">
        Based on current performance metrics and industry benchmarks, Herman Supply Chain Solutions
        estimates an annual savings opportunity of <strong>${fmtDollar(r.annualSavings)}</strong> through
        route optimization, cost restructuring, and performance improvement initiatives.
      </p>
    </div>

    <div class="results-actions no-print">
      <button class="btn btn-navy" onclick="window.print()">🖨 Print Report</button>
      <button class="btn btn-primary" onclick="window.print()">⬇ Download PDF</button>
      <a href="contact.html" class="btn btn-green">Talk to an Expert →</a>
      <button class="btn btn-outline" style="color:var(--navy); border-color:var(--gray-300);" onclick="window.location.href='assessment.html'">Retake Assessment</button>
    </div>
  `;
}

// ---- CONTACT FORM ----
async function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = {
      name: document.getElementById('contactName').value.trim(),
      company: document.getElementById('contactCompany').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      message: document.getElementById('contactMessage').value.trim()
    };

    const response = await supabaseInsert('contact_submissions', data);

    if (response.ok || response.status === 201) {
      btn.textContent = 'Request Sent ✓';
      btn.style.background = 'var(--green)';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Request Consultation';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    } else {
      btn.textContent = 'Something went wrong — try again';
      btn.style.background = '#CC4444';
      btn.disabled = false;
    }
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAssessmentForm();
  initResults();
  initContactForm();
});
