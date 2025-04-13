document.getElementById('csvFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function (event) {
      const lines = event.target.result.split('\n').slice(1); // skip header
      let data = [];
      let categoryTotals = {};
      document.getElementById('insightBox').innerHTML = ""; // reset insights
  
      let tableHtml = "<h3>📋 Transaction Table</h3><table><tr><th>Date</th><th>Category</th><th>Amount</th></tr>";
  
      lines.forEach(line => {
        const [date, category, amount] = line.split(',');
        if (category && amount && !isNaN(amount)) {
          const amountValue = parseFloat(amount);
          data.push({ date, category, amount: amountValue });
          tableHtml += `<tr><td>${date}</td><td>${category}</td><td>₹${amountValue.toFixed(2)}</td></tr>`;
  
          categoryTotals[category] = (categoryTotals[category] || 0) + amountValue;
        }
      });
  
      tableHtml += "</table>";
      document.getElementById('tableContainer').innerHTML = tableHtml;
  
      drawChart(categoryTotals);
      showInsights(data);
    };
  
    reader.readAsText(file);
  });
  
  function drawChart(data) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Spending (₹)',
          data: Object.values(data),
          backgroundColor: [
            '#ff7043', '#42a5f5', '#66bb6a', '#ab47bc', '#ffa726',
            '#26c6da', '#ef5350', '#8d6e63', '#78909c'
          ],
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff'
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutBounce'
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  function showInsights(data) {
    const totalSpend = data.reduce((sum, entry) => sum + entry.amount, 0);
    const days = new Set(data.map(d => d.date)).size;
    const avgSpend = totalSpend / days;
  
    let remark = "";
    if (avgSpend < 500) {
      remark = "✅ You're spending wisely! Great job staying within budget.";
    } else if (avgSpend >= 500 && avgSpend <= 1000) {
      remark = "⚠️ You're spending moderately. Consider reviewing your non-essential expenses.";
    } else {
      remark = "❗ High daily spend detected! Try setting a savings goal or limiting impulse buys.";
    }
  
    document.getElementById('insightBox').innerText = remark;
  }
  