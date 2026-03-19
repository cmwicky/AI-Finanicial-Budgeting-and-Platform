// =======================
// API Configuration
// =======================
// For local development: http://localhost:8000
// For production: Replace with your Render backend URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : 'https://finai-backend.onrender.com'; // UPDATE THIS WITH YOUR RENDER URL

// =======================
// Utility Functions
// =======================
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    return null;
  }
}

// =======================
// AI Recommendations Page
// =======================
async function loadAIRecommendations() {
  const recList = document.getElementById("ai-recommendations");
  if (!recList) return;

  // Clear existing recommendations
  recList.innerHTML = '<li>Loading AI recommendations...</li>';

  // TODO: Replace with actual user_id and budget_id from authentication/session
  const userId = 1; // Placeholder - should come from user session
  const budgetId = 1; // Placeholder - should come from selected budget

  const recommendations = await apiCall(`/api/v1/ai-advisor/${userId}/recommendations?budget_id=${budgetId}`);

  recList.innerHTML = ''; // Clear loading message

  if (recommendations && recommendations.length > 0) {
    recommendations.forEach(rec => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${rec.type}:</strong> ${rec.message}<br><small>${rec.rationale}</small>`;
      recList.appendChild(li);
    });
  } else {
    // Fallback to static recommendations if API fails
    const fallbackRecs = [
      "Increase allocation to miscellaneous funds.",
      "Save more by trying homemade food instead of buying it.",
      "Try getting a part-time student friendly job for extra income."
    ];
    fallbackRecs.forEach(rec => {
      const li = document.createElement("li");
      li.textContent = rec;
      recList.appendChild(li);
    });
  }
}

// =======================
// Transactions Page
// =======================
async function loadTransactions() {
  const table = document.getElementById("transactions-table");
  if (!table) return;

  // Clear existing rows except header
  const rows = table.querySelectorAll('tr:not(:first-child)');
  rows.forEach(row => row.remove());

  // TODO: Replace with actual user_id from authentication/session
  const userId = 1; // Placeholder - should come from user session

  const expenses = await apiCall(`/api/v1/expenses?user_id=${userId}&limit=20`);

  if (expenses && expenses.length > 0) {
    expenses.forEach(expense => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(expense.date).toLocaleDateString()}</td>
        <td>${expense.description || 'No description'}</td>
        <td>$${expense.amount.toFixed(2)}</td>
      `;
      table.appendChild(row);
    });
  } else {
    // Add a message if no transactions
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="3" style="text-align: center;">No transactions found</td>';
    table.appendChild(row);
  }
}

// =======================
// Visual Analysis Page
// =======================
async function loadPortfolioChart() {
  const portfolioCanvas = document.getElementById("portfolioChart");
  if (!portfolioCanvas) return;

  // TODO: Replace with actual user_id and budget_id from authentication/session
  const userId = 1; // Placeholder - should come from user session
  const budgetId = 1; // Placeholder - should come from selected budget

  // Get budget category limits for portfolio allocation
  const categoryLimits = await apiCall(`/api/v1/budgets/${budgetId}/category-limits`);

  if (categoryLimits && categoryLimits.length > 0) {
    const labels = categoryLimits.map(cat => cat.category_name);
    const data = categoryLimits.map(cat => cat.limit_amount);

    new Chart(portfolioCanvas, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ["#d4c89f", "#f5f5dc", "#102b54", "#1c3b70", "#b10552"],
          borderColor: "#0b1d3a",
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: "#f5f5dc" } }
        }
      }
    });
  } else {
    // Fallback to static data if API fails
    new Chart(portfolioCanvas, {
      type: "pie",
      data: {
        labels: ["Rent", "Food & Bills", "Transport", "Entertainment"],
        datasets: [{
          data: [5000, 2000, 1500, 3950],
          backgroundColor: ["#d4c89f", "#f5f5dc", "#102b54", "#1c3b70"],
          borderColor: "#0b1d3a",
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: "#f5f5dc" } }
        }
      }
    });
  }
}

async function loadExpenseChart() {
  const expenseCanvas = document.getElementById("expenseChart");
  if (!expenseCanvas) return;

  // TODO: Replace with actual user_id from authentication/session
  const userId = 1; // Placeholder - should come from user session

  // Get expenses for the last 5 months
  const expenses = await apiCall(`/api/v1/expenses?user_id=${userId}&limit=100`);

  if (expenses && expenses.length > 0) {
    // Group expenses by month
    const monthlyExpenses = {};
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;
    });

    const labels = Object.keys(monthlyExpenses).slice(-5); // Last 5 months
    const data = labels.map(month => monthlyExpenses[month]);

    new Chart(expenseCanvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Expenses ($)",
          data: data,
          backgroundColor: "#d4c89f"
        }]
      },
      options: {
        scales: {
          x: { ticks: { color: "#f5f5dc" } },
          y: { ticks: { color: "#f5f5dc" } }
        },
        plugins: {
          legend: { labels: { color: "#f5f5dc" } }
        }
      }
    });
  } else {
    // Fallback to static data if API fails
    new Chart(expenseCanvas, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [{
          label: "Expenses ($)",
          data: [1200, 950, 1100, 800, 1000],
          backgroundColor: "#d4c89f"
        }]
      },
      options: {
        scales: {
          x: { ticks: { color: "#f5f5dc" } },
          y: { ticks: { color: "#f5f5dc" } }
        },
        plugins: {
          legend: { labels: { color: "#f5f5dc" } }
        }
      }
    });
  }
}

function loadMarketChart() {
  const marketCanvas = document.getElementById("marketChart");
  if (!marketCanvas) return;

  // Market trends - this could be from an external API in production
  // For now, keeping the static data
  new Chart(marketCanvas, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: "S&P 500",
          data: [1.2, 1.5, 1.3, 1.6, 1.4],
          borderColor: "#d4c89f",
          fill: false
        },
        {
          label: "NASDAQ",
          data: [-0.8, -0.5, -0.6, -0.4, -0.7],
          borderColor: "#f5f5dc",
          fill: false
        },
        {
          label: "Gold",
          data: [0.5, 0.7, 0.6, 0.8, 0.9],
          borderColor: "#1c3b70",
          fill: false
        }
      ]
    },
    options: {
      scales: {
        x: { ticks: { color: "#f5f5dc" } },
        y: { ticks: { color: "#f5f5dc" } }
      },
      plugins: {
        legend: { labels: { color: "#f5f5dc" } }
      }
    }
  });
}

// =======================
// Page Load Handlers
// =======================
document.addEventListener('DOMContentLoaded', function() {
  // Load data based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  switch(currentPage) {
    case 'insights.html':
      loadAIRecommendations();
      break;
    case 'transactions.html':
      loadTransactions();
      break;
    case 'analysis.html':
      loadPortfolioChart();
      loadExpenseChart();
      loadMarketChart();
      break;
    default:
      // Dashboard or other pages - could load summary data here
      break;
  }
});