// // Custom simple chart implementation to replace Chart.js
// class SimpleChart {
//   constructor(canvas, config) {
//     this.canvas = canvas;
//     this.ctx = canvas.getContext('2d');
//     this.config = config;
//     this.draw();
//   }
  
//   draw() {
//     const ctx = this.ctx;
//     const canvas = this.canvas;
//     const width = canvas.width = canvas.offsetWidth * 2; // High DPI
//     const height = canvas.height = canvas.offsetHeight * 2;
//     canvas.style.width = canvas.offsetWidth + 'px';
//     canvas.style.height = canvas.offsetHeight + 'px';
//     ctx.scale(2, 2); // High DPI scaling
    
//     const actualWidth = width / 2;
//     const actualHeight = height / 2;
    
//     // Clear canvas
//     ctx.clearRect(0, 0, actualWidth, actualHeight);
    
//     if (this.config.type === 'line') {
//       this.drawLineChart(ctx, actualWidth, actualHeight);
//     } else if (this.config.type === 'doughnut') {
//       this.drawDoughnutChart(ctx, actualWidth, actualHeight);
//     }
//   }
  
//   drawLineChart(ctx, width, height) {
//     const data = this.config.data.datasets[0].data;
//     const labels = this.config.data.labels;
//     const padding = 40;
//     const chartWidth = width - padding * 2;
//     const chartHeight = height - padding * 2;
    
//     // Find max value for scaling
//     const maxValue = Math.max(...data, 1);
    
//     // Draw grid lines
//     ctx.strokeStyle = '#e0e0e0';
//     ctx.lineWidth = 1;
    
//     // Horizontal grid lines
//     for (let i = 0; i <= 5; i++) {
//       const y = padding + (chartHeight / 5) * i;
//       ctx.beginPath();
//       ctx.moveTo(padding, y);
//       ctx.lineTo(width - padding, y);
//       ctx.stroke();
//     }
    
//     // Draw axes
//     ctx.strokeStyle = '#666';
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.moveTo(padding, padding);
//     ctx.lineTo(padding, height - padding);
//     ctx.lineTo(width - padding, height - padding);
//     ctx.stroke();
    
//     // Draw line
//     if (data.length > 0) {
//       ctx.strokeStyle = '#4CAF50';
//       ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
//       ctx.lineWidth = 3;
      
//       const stepX = chartWidth / (data.length - 1 || 1);
      
//       // Create path for line
//       ctx.beginPath();
//       ctx.moveTo(padding, height - padding);
      
//       data.forEach((value, index) => {
//         const x = padding + stepX * index;
//         const y = height - padding - (value / maxValue) * chartHeight;
//         if (index === 0) {
//           ctx.lineTo(x, y);
//         } else {
//           ctx.lineTo(x, y);
//         }
//       });
      
//       // Fill area under line
//       ctx.lineTo(width - padding, height - padding);
//       ctx.closePath();
//       ctx.fill();
      
//       // Draw line
//       ctx.beginPath();
//       data.forEach((value, index) => {
//         const x = padding + stepX * index;
//         const y = height - padding - (value / maxValue) * chartHeight;
//         if (index === 0) {
//           ctx.moveTo(x, y);
//         } else {
//           ctx.lineTo(x, y);
//         }
//       });
//       ctx.stroke();
      
//       // Draw points
//       ctx.fillStyle = '#4CAF50';
//       data.forEach((value, index) => {
//         const x = padding + stepX * index;
//         const y = height - padding - (value / maxValue) * chartHeight;
//         ctx.beginPath();
//         ctx.arc(x, y, 4, 0, 2 * Math.PI);
//         ctx.fill();
//       });
//     }
    
//     // Draw labels
//     ctx.fillStyle = '#666';
//     ctx.font = '12px Arial';
//     ctx.textAlign = 'center';
//     labels.forEach((label, index) => {
//       const x = padding + (chartWidth / (labels.length - 1 || 1)) * index;
//       ctx.fillText(label, x, height - padding + 20);
//     });
    
//     // Draw y-axis labels
//     ctx.textAlign = 'right';
//     for (let i = 0; i <= 5; i++) {
//       const value = (maxValue / 5) * (5 - i);
//       const y = padding + (chartHeight / 5) * i;
//       ctx.fillText(Math.round(value) + 'g', padding - 10, y + 4);
//     }
//   }
  
//   drawDoughnutChart(ctx, width, height) {
//     const data = this.config.data.datasets[0].data;
//     const labels = this.config.data.labels;
//     const colors = this.config.data.datasets[0].backgroundColor;
    
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const radius = Math.min(width, height) / 3;
//     const innerRadius = radius * 0.6;
    
//     const total = data.reduce((sum, val) => sum + val, 0);
    
//     if (total === 0) {
//       ctx.fillStyle = '#ccc';
//       ctx.font = '16px Arial';
//       ctx.textAlign = 'center';
//       ctx.fillText('No data available', centerX, centerY);
//       return;
//     }
    
//     let currentAngle = -Math.PI / 2;
    
//     // Draw segments
//     data.forEach((value, index) => {
//       if (value > 0) {
//         const sliceAngle = (value / total) * 2 * Math.PI;
        
//         // Draw segment
//         ctx.fillStyle = colors[index];
//         ctx.beginPath();
//         ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
//         ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
//         ctx.closePath();
//         ctx.fill();
        
//         currentAngle += sliceAngle;
//       }
//     });
    
//     // Draw legend
//     const legendY = height - 100;
//     const legendItemWidth = width / labels.length;
    
//     labels.forEach((label, index) => {
//       const x = legendItemWidth * index + 20;
      
//       // Draw color box
//       ctx.fillStyle = colors[index];
//       ctx.fillRect(x, legendY, 15, 15);
      
//       // Draw label
//       ctx.fillStyle = '#666';
//       ctx.font = '12px Arial';
//       ctx.textAlign = 'left';
//       ctx.fillText(label, x + 20, legendY + 12);
//     });
//   }
// }

// // Dashboard JavaScript with custom charts
// let dailyChart, categoryChart;

// document.addEventListener('DOMContentLoaded', async () => {
//   await loadDashboardData();
// });

// async function loadDashboardData() {
//   try {
//     const result = await chrome.storage.local.get([
//       'totalEmissions',
//       'dailyEmissions', 
//       'visitedSites'
//     ]);
    
//     console.log('Loaded data:', result);
    
//     // Update header stats
//     updateHeaderStats(result);
    
//     // Load all dashboard sections
//     await loadDailyEmissions(result.dailyEmissions || {});
//     await loadTopSites(result.visitedSites || []);
//     await loadCategoryBreakdown(result.visitedSites || []);
//     await loadRecommendations(result.visitedSites || []);
//     await loadRecentActivity(result.visitedSites || []);
//     await loadComparisons(result.totalEmissions || 0);
    
//   } catch (error) {
//     console.error('Error loading dashboard data:', error);
//     showErrorState();
//   }
// }

// function updateHeaderStats(data) {
//   const totalEmissions = data.totalEmissions || 0;
//   const visitedSites = data.visitedSites || [];
  
//   document.getElementById('totalEmissions').textContent = Math.round(totalEmissions);
//   document.getElementById('sitesVisited').textContent = visitedSites.length;
// }

// async function loadDailyEmissions(dailyEmissions) {
//   const canvas = document.getElementById('dailyChart');
  
//   // Get last 7 days
//   const dates = [];
//   const emissions = [];
  
//   for (let i = 6; i >= 0; i--) {
//     const date = new Date();
//     date.setDate(date.getDate() - i);
//     const dateString = date.toDateString();
    
//     dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
//     emissions.push(dailyEmissions[dateString] || 0);
//   }
  
//   dailyChart = new SimpleChart(canvas, {
//     type: 'line',
//     data: {
//       labels: dates,
//       datasets: [{
//         label: 'Daily CO₂ Emissions (g)',
//         data: emissions,
//         borderColor: '#4CAF50',
//         backgroundColor: 'rgba(76, 175, 80, 0.1)'
//       }]
//     }
//   });
// }

// async function loadTopSites(visitedSites) {
//   const siteEmissions = {};
  
//   // Aggregate emissions by domain
//   visitedSites.forEach(site => {
//     const domain = site.domain || (site.url ? new URL(site.url).hostname : 'unknown');
//     siteEmissions[domain] = (siteEmissions[domain] || 0) + (site.emissions || 0);
//   });
  
//   // Sort by emissions
//   const sortedSites = Object.entries(siteEmissions)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5);
  
//   const container = document.getElementById('topSitesList');
  
//   if (sortedSites.length === 0) {
//     container.innerHTML = `
//       <div class="empty-state">
//         <div class="empty-state-icon">🌐</div>
//         <div class="empty-state-title">No data yet</div>
//         <div class="empty-state-desc">Start browsing to see your top emitting sites</div>
//       </div>
//     `;
//     return;
//   }
  
//   container.innerHTML = sortedSites.map(([domain, emissions]) => {
//     const level = emissions > 500 ? 'high' : emissions > 200 ? 'medium' : 'low';
//     return `
//       <div class="site-item ${level}">
//         <span class="site-name">${domain}</span>
//         <span class="site-emissions">${Math.round(emissions)}g CO₂</span>
//       </div>
//     `;
//   }).join('');
// }

// async function loadCategoryBreakdown(visitedSites) {
//   const categories = {
//     'Video Streaming': 0,
//     'Social Media': 0,
//     'E-commerce': 0,
//     'Search': 0,
//     'News': 0,
//     'Other': 0
//   };
  
//   visitedSites.forEach(site => {
//     const domain = site.domain || (site.url ? new URL(site.url).hostname : 'unknown');
//     const category = categorizeWebsite(domain);
//     categories[category] += site.emissions || 0;
//   });
  
//   const canvas = document.getElementById('categoryChart');
  
//   categoryChart = new SimpleChart(canvas, {
//     type: 'doughnut',
//     data: {
//       labels: Object.keys(categories),
//       datasets: [{
//         data: Object.values(categories),
//         backgroundColor: [
//           '#FF6B6B',
//           '#4ECDC4',
//           '#45B7D1',
//           '#96CEB4',
//           '#FECA57',
//           '#DDA0DD'
//         ]
//       }]
//     }
//   });
// }

// function categorizeWebsite(domain) {
//   if (domain.includes('youtube') || domain.includes('netflix') || 
//       domain.includes('twitch') || domain.includes('vimeo')) {
//     return 'Video Streaming';
//   }
//   if (domain.includes('facebook') || domain.includes('instagram') || 
//       domain.includes('twitter') || domain.includes('linkedin')) {
//     return 'Social Media';
//   }
//   if (domain.includes('amazon') || domain.includes('ebay') || 
//       domain.includes('shop') || domain.includes('store')) {
//     return 'E-commerce';
//   }
//   if (domain.includes('google') || domain.includes('bing') || 
//       domain.includes('search')) {
//     return 'Search';
//   }
//   if (domain.includes('news') || domain.includes('cnn') || 
//       domain.includes('bbc') || domain.includes('reddit')) {
//     return 'News';
//   }
//   return 'Other';
// }

// async function loadRecommendations(visitedSites) {
//   const container = document.getElementById('recommendationsList');
  
//   const recommendations = [
//     '🌱 Use Ecosia search engine to plant trees while searching',
//     '📱 Use mobile apps instead of web browsers when available',
//     '🔌 Enable power-saving mode on your device',
//     '📺 Choose lower video quality (720p instead of 1080p)',
//     '🚫 Use ad blockers to reduce unnecessary data transfer',
//     '🗂️ Bookmark frequently visited sites to reduce search emissions',
//     '⚡ Close unused browser tabs to save CPU and memory',
//     '🌙 Use dark mode to reduce screen energy consumption'
//   ];
  
//   // Shuffle and take 3 random recommendations
//   const shuffled = recommendations.sort(() => 0.5 - Math.random());
//   const selected = shuffled.slice(0, 3);
  
//   container.innerHTML = selected.map(rec => 
//     `<div class="recommendation-item">${rec}</div>`
//   ).join('');
// }

// async function loadRecentActivity(visitedSites) {
//   const tbody = document.getElementById('activityTableBody');
  
//   if (visitedSites.length === 0) {
//     tbody.innerHTML = `
//       <tr>
//         <td colspan="5" style="text-align: center; padding: 40px;">
//           <div class="empty-state-icon" style="font-size: 48px; margin-bottom: 16px;">📋</div>
//           <div style="font-weight: 600; margin-bottom: 8px;">No activity yet</div>
//           <div style="color: #666; font-size: 14px;">Your recent browsing activity will appear here</div>
//         </td>
//       </tr>
//     `;
//     return;
//   }
  
//   // Get last 10 visits
//   const recentSites = visitedSites
//     .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
//     .slice(0, 10);
  
//   tbody.innerHTML = recentSites.map(site => {
//     const date = new Date(site.timestamp || Date.now());
//     const domain = site.domain || (site.url ? new URL(site.url).hostname : 'unknown');
//     const category = categorizeWebsite(domain);
//     const emissions = site.emissions || 0;
//     const impactLevel = emissions > 200 ? 'high' : emissions > 50 ? 'medium' : 'low';
    
//     return `
//       <tr>
//         <td>${date.toLocaleTimeString()}</td>
//         <td>${domain}</td>
//         <td>${category}</td>
//         <td>${Math.round(emissions)}g</td>
//         <td><span class="impact-badge impact-${impactLevel}">${impactLevel}</span></td>
//       </tr>
//     `;
//   }).join('');
// }

// async function loadComparisons(totalEmissions) {
//   const container = document.getElementById('comparisonContent');
  
//   const comparisons = [];
  
//   // Convert to various equivalents
//   const treeEquivalent = Math.round(totalEmissions / 21000); // Average tree absorbs 21kg CO2 per year
//   const carEquivalent = Math.round(totalEmissions / 411); // Average car emits 411g CO2 per km
//   const lightbulbHours = Math.round(totalEmissions / 0.5); // LED bulb emits ~0.5g CO2 per hour
  
//   if (treeEquivalent > 0) {
//     comparisons.push({
//       icon: '🌳',
//       title: `${treeEquivalent} tree${treeEquivalent > 1 ? 's' : ''} needed`,
//       desc: 'To offset your total browsing emissions for a year'
//     });
//   }
  
//   if (carEquivalent > 0) {
//     comparisons.push({
//       icon: '🚗',
//       title: `${carEquivalent}km car ride`,
//       desc: 'Equivalent emissions from driving'
//     });
//   }
  
//   comparisons.push({
//     icon: '💡',
//     title: `${lightbulbHours} hours of LED lighting`,
//     desc: 'Equivalent energy consumption'
//   });
  
//   if (totalEmissions > 1000) {
//     comparisons.push({
//       icon: '📱',
//       title: 'Smartphone charging',
//       desc: `Could charge your phone ${Math.round(totalEmissions / 8)} times`
//     });
//   }
  
//   // Add default message if no comparisons
//   if (comparisons.length === 0) {
//     comparisons.push({
//       icon: '🌱',
//       title: 'Great start!',
//       desc: 'Keep browsing to see environmental impact comparisons'
//     });
//   }
  
//   container.innerHTML = comparisons.map(comp => `
//     <div class="comparison-item">
//       <div class="comparison-icon">${comp.icon}</div>
//       <div class="comparison-text">
//         <div class="comparison-title">${comp.title}</div>
//         <div class="comparison-desc">${comp.desc}</div>
//       </div>
//     </div>
//   `).join('');
// }

// function showErrorState() {
//   document.querySelector('.dashboard-grid').innerHTML = `
//     <div class="card full-width">
//       <div class="card-content">
//         <div style="text-align: center; padding: 48px;">
//           <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
//           <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Unable to load data</div>
//           <div style="color: #666; font-size: 14px;">Please try refreshing the page or check your extension settings.</div>
//         </div>
//       </div>
//     </div>
//   `;
// }


// Custom simple chart implementation to replace Chart.js
class SimpleChart {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;
    this.draw();
  }
  
  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    
    // Set canvas size properly
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Set actual canvas size (for high DPI)
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    
    // Scale the canvas back down using CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // Scale the drawing context so everything draws at the correct size
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (this.config.type === 'line') {
      this.drawLineChart(ctx, width, height);
    } else if (this.config.type === 'doughnut') {
      this.drawDoughnutChart(ctx, width, height);
    }
  }
  
  drawLineChart(ctx, width, height) {
    const data = this.config.data.datasets[0].data;
    const labels = this.config.data.labels;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2 - 30; // Extra space for labels
    
    // Find max value for scaling
    const maxValue = Math.max(...data, 1);
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(width - padding, padding + chartHeight);
    ctx.stroke();
    
    // Draw line and area if we have data
    if (data.length > 1) {
      ctx.strokeStyle = '#4CAF50';
      ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
      ctx.lineWidth = 3;
      
      const stepX = chartWidth / (data.length - 1);
      
      // Create path for area fill
      ctx.beginPath();
      ctx.moveTo(padding, padding + chartHeight);
      
      data.forEach((value, index) => {
        const x = padding + stepX * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        ctx.lineTo(x, y);
      });
      
      ctx.lineTo(padding + chartWidth, padding + chartHeight);
      ctx.closePath();
      ctx.fill();
      
      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;
      
      data.forEach((value, index) => {
        const x = padding + stepX * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw points
      ctx.fillStyle = '#4CAF50';
      data.forEach((value, index) => {
        const x = padding + stepX * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else if (data.length === 1) {
      // Handle single data point
      const x = width / 2;
      const y = padding + chartHeight - (data[0] / maxValue) * chartHeight;
      
      // Draw area
      ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
      ctx.fillRect(padding, y, chartWidth, padding + chartHeight - y);
      
      // Draw point
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw x-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
      const x = padding + (chartWidth / Math.max(labels.length - 1, 1)) * index;
      ctx.fillText(label, x, padding + chartHeight + 20);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(Math.round(value) + 'g', padding - 10, y);
    }
  }
  
  drawDoughnutChart(ctx, width, height) {
    const data = this.config.data.datasets[0].data;
    const labels = this.config.data.labels;
    const colors = this.config.data.datasets[0].backgroundColor;
    
    const centerX = width / 2;
    const centerY = (height - 60) / 2; // Leave space for legend
    const radius = Math.min(width, height - 60) / 3;
    const innerRadius = radius * 0.6;
    
    const total = data.reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
      ctx.fillStyle = '#ccc';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No data available', centerX, centerY);
      return;
    }
    
    let currentAngle = -Math.PI / 2;
    
    // Draw segments
    data.forEach((value, index) => {
      if (value > 0) {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // Draw segment
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();
        
        currentAngle += sliceAngle;
      }
    });
    
    // Draw legend at bottom
    const legendY = height - 40;
    const legendItemHeight = 20;
    const activeLabels = labels.filter((_, index) => data[index] > 0);
    const legendRows = Math.ceil(activeLabels.length / 2);
    const legendStartY = legendY - (legendRows * legendItemHeight);
    
    let itemIndex = 0;
    labels.forEach((label, index) => {
      if (data[index] > 0) {
        const row = Math.floor(itemIndex / 2);
        const col = itemIndex % 2;
        const x = (width / 4) * (1 + col * 2);
        const y = legendStartY + (row * legendItemHeight);
        
        // Draw color box
        ctx.fillStyle = colors[index];
        ctx.fillRect(x - 50, y - 6, 12, 12);
        
        // Draw label
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const truncatedLabel = label.length > 12 ? label.substring(0, 12) + '...' : label;
        ctx.fillText(truncatedLabel, x - 35, y);
        
        itemIndex++;
      }
    });
  }
}

// Dashboard JavaScript with custom charts
let dailyChart, categoryChart;

document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    const result = await chrome.storage.local.get([
      'totalEmissions',
      'dailyEmissions', 
      'visitedSites'
    ]);
    
    console.log('Loaded data:', result);
    
    // Update header stats
    updateHeaderStats(result);
    
    // Load all dashboard sections
    await loadDailyEmissions(result.dailyEmissions || {});
    await loadTopSites(result.visitedSites || []);
    await loadCategoryBreakdown(result.visitedSites || []);
    await loadRecommendations(result.visitedSites || []);
    await loadRecentActivity(result.visitedSites || []);
    await loadComparisons(result.totalEmissions || 0);
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showErrorState();
  }
}

function updateHeaderStats(data) {
  const totalEmissions = data.totalEmissions || 0;
  const visitedSites = data.visitedSites || [];
  
  document.getElementById('totalEmissions').textContent = Math.round(totalEmissions);
  document.getElementById('sitesVisited').textContent = visitedSites.length;
}

async function loadDailyEmissions(dailyEmissions) {
  const canvas = document.getElementById('dailyChart');
  
  // Get last 7 days
  const dates = [];
  const emissions = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toDateString();
    
    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    emissions.push(dailyEmissions[dateString] || 0);
  }
  
  // Wait for next frame to ensure canvas is properly sized
  requestAnimationFrame(() => {
    dailyChart = new SimpleChart(canvas, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Daily CO₂ Emissions (g)',
          data: emissions,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)'
        }]
      }
    });
  });
}

async function loadTopSites(visitedSites) {
  const siteEmissions = {};
  
  // Aggregate emissions by domain
  visitedSites.forEach(site => {
    const domain = site.domain || (site.url ? new URL(site.url).hostname : 'unknown');
    siteEmissions[domain] = (siteEmissions[domain] || 0) + (site.emissions || 0);
  });
  
  // Sort by emissions
  const sortedSites = Object.entries(siteEmissions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const container = document.getElementById('topSitesList');
  
  if (sortedSites.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌐</div>
        <div class="empty-state-title">No data yet</div>
        <div class="empty-state-desc">Start browsing to see your top emitting sites</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sortedSites.map(([domain, emissions]) => {
    const level = emissions > 500 ? 'high' : emissions > 200 ? 'medium' : 'low';
    return `
      <div class="site-item ${level}">
        <span class="site-name">${domain}</span>
        <span class="site-emissions">${Math.round(emissions)}g CO₂</span>
      </div>
    `;
  }).join('');
}

async function loadCategoryBreakdown(visitedSites) {
  const categories = {
    'Video Streaming': 0,
    'Social Media': 0,
    'E-commerce': 0,
    'Search': 0,
    'News': 0,
    'Other': 0
  };
  
  visitedSites.forEach(site => {
    const domain = site.domain || (site.url ? new URL(site.url).hostname : 'unknown');
    const category = categorizeWebsite(domain);
    categories[category] += site.emissions || 0;
  });
  
  const canvas = document.getElementById('categoryChart');
  
  // Wait for next frame to ensure canvas is properly sized
  requestAnimationFrame(() => {
    categoryChart = new SimpleChart(canvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categories),
        datasets: [{
          data: Object.values(categories),
          backgroundColor: [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FECA57',
            '#DDA0DD'
          ]
        }]
      }
    });
  });
}

function categorizeWebsite(domain) {
  if (domain.includes('youtube') || domain.includes('netflix') || 
      domain.includes('twitch') || domain.includes('vimeo')) {
    return 'Video Streaming';
  }
  if (domain.includes('facebook') || domain.includes('instagram') || 
      domain.includes('twitter') || domain.includes('linkedin')) {
    return 'Social Media';
  }
  if (domain.includes('amazon') || domain.includes('ebay') || 
      domain.includes('shop') || domain.includes('store')) {
    return 'E-commerce';
  }
  if (domain.includes('google') || domain.includes('bing') || 
      domain.includes('search')) {
    return 'Search';
  }
  if (domain.includes('news') || domain.includes('cnn') || 
      domain.includes('bbc') || domain.includes('reddit')) {
    return 'News';
  }
  return 'Other';
}

async function loadRecommendations(visitedSites) {
  const container = document.getElementById('recommendationsList');
  
  const recommendations = [
    '🌱 Use Ecosia search engine to plant trees while searching',
    '📱 Use mobile apps instead of web browsers when available',
    '🔌 Enable power-saving mode on your device',
    '📺 Choose lower video quality (720p instead of 1080p)',
    '🚫 Use ad blockers to reduce unnecessary data transfer',
    '🗂️ Bookmark frequently visited sites to reduce search emissions',
    '⚡ Close unused browser tabs to save CPU and memory',
    '🌙 Use dark mode to reduce screen energy consumption'
  ];
  
  // Shuffle and take 3 random recommendations
  const shuffled = recommendations.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  container.innerHTML = selected.map(rec => 
    `<div class="recommendation-item">${rec}</div>`
  ).join('');
}

async function loadRecentActivity(visitedSites) {
  const tbody = document.getElementById('activityTableBody');
  
  if (visitedSites.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px;">
          <div class="empty-state-icon" style="font-size: 48px; margin-bottom: 16px;">📋</div>
          <div style="font-weight: 600; margin-bottom: 8px;">No activity yet</div>
          <div style="color: #666; font-size: 14px;">Your recent browsing activity will appear here</div>
        </td>
      </tr>
    `;
    return;
  }
  
  // Get last 10 visits
  const recentSites = visitedSites
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 10);
  
  tbody.innerHTML = recentSites.map(site => {
    const date = new Date(site.timestamp || Date.now());
    const domain = site.domain || (site.url ? new URL(site.url).hostname : 'unknown');
    const category = categorizeWebsite(domain);
    const emissions = site.emissions || 0;
    const impactLevel = emissions > 200 ? 'high' : emissions > 50 ? 'medium' : 'low';
    
    return `
      <tr>
        <td>${date.toLocaleTimeString()}</td>
        <td>${domain}</td>
        <td>${category}</td>
        <td>${Math.round(emissions)}g</td>
        <td><span class="impact-badge impact-${impactLevel}">${impactLevel}</span></td>
      </tr>
    `;
  }).join('');
}

async function loadComparisons(totalEmissions) {
  const container = document.getElementById('comparisonContent');
  
  const comparisons = [];
  
  // Convert to various equivalents
  const treeEquivalent = Math.round(totalEmissions / 21000); // Average tree absorbs 21kg CO2 per year
  const carEquivalent = Math.round(totalEmissions / 411); // Average car emits 411g CO2 per km
  const lightbulbHours = Math.round(totalEmissions / 0.5); // LED bulb emits ~0.5g CO2 per hour
  
  if (treeEquivalent > 0) {
    comparisons.push({
      icon: '🌳',
      title: `${treeEquivalent} tree${treeEquivalent > 1 ? 's' : ''} needed`,
      desc: 'To offset your total browsing emissions for a year'
    });
  }
  
  if (carEquivalent > 0) {
    comparisons.push({
      icon: '🚗',
      title: `${carEquivalent}km car ride`,
      desc: 'Equivalent emissions from driving'
    });
  }
  
  comparisons.push({
    icon: '💡',
    title: `${lightbulbHours} hours of LED lighting`,
    desc: 'Equivalent energy consumption'
  });
  
  if (totalEmissions > 1000) {
    comparisons.push({
      icon: '📱',
      title: 'Smartphone charging',
      desc: `Could charge your phone ${Math.round(totalEmissions / 8)} times`
    });
  }
  
  // Add default message if no comparisons
  if (comparisons.length === 0) {
    comparisons.push({
      icon: '🌱',
      title: 'Great start!',
      desc: 'Keep browsing to see environmental impact comparisons'
    });
  }
  
  container.innerHTML = comparisons.map(comp => `
    <div class="comparison-item">
      <div class="comparison-icon">${comp.icon}</div>
      <div class="comparison-text">
        <div class="comparison-title">${comp.title}</div>
        <div class="comparison-desc">${comp.desc}</div>
      </div>
    </div>
  `).join('');
}

function showErrorState() {
  document.querySelector('.dashboard-grid').innerHTML = `
    <div class="card full-width">
      <div class="card-content">
        <div style="text-align: center; padding: 48px;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Unable to load data</div>
          <div style="color: #666; font-size: 14px;">Please try refreshing the page or check your extension settings.</div>
        </div>
      </div>
    </div>
  `;
}