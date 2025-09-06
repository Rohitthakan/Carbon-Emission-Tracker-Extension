document.addEventListener('DOMContentLoaded', async () => {
  await loadPopupData();
  setupEventListeners();
});

async function loadPopupData() {
  try {
    const result = await chrome.storage.local.get([
      'totalEmissions', 
      'dailyEmissions', 
      'visitedSites'
    ]);
    
    const totalEmissions = result.totalEmissions || 0;
    document.getElementById('totalEmissions').textContent = Math.round(totalEmissions);
    
    const today = new Date().toDateString();
    const todayEmissions = result.dailyEmissions?.[today] || 0;
    document.getElementById('todayEmissions').textContent = Math.round(todayEmissions);
    
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await updateCurrentSiteInfo(tabs[0]);
    }
    
    generateRecommendations(result.visitedSites || []);
    
  } catch (error) {
    console.error('Error loading popup data:', error);
  }
}

async function updateCurrentSiteInfo(tab) {
  try {
    const url = new URL(tab.url);
    const domain = url.hostname;
    
    document.getElementById('currentSite').textContent = domain;
    
    const emissions = estimateSiteEmissions(domain);
    document.getElementById('currentEmissions').textContent = `${emissions}g CO₂`;

    updateEmissionLevelIndicator(emissions);
    
  } catch (error) {
    console.error('Error updating current site info:', error);
    document.getElementById('currentSite').textContent = 'Unknown site';
  }
}

function estimateSiteEmissions(domain) {
  let sizeMB = 2.5; 
  
  // Video streaming sites
  if (domain.includes('youtube') || domain.includes('netflix') || 
      domain.includes('twitch') || domain.includes('vimeo')) {
    sizeMB = 50;
  }
  // Image-heavy sites
  else if (domain.includes('instagram') || domain.includes('pinterest') || 
           domain.includes('imgur') || domain.includes('flickr')) {
    sizeMB = 8;
  }
  // Search engines
  else if (domain.includes('google') || domain.includes('bing') || 
           domain.includes('duckduckgo')) {
    sizeMB = 1;
  }
  // News sites
  else if (domain.includes('news') || domain.includes('cnn') || 
           domain.includes('bbc') || domain.includes('reddit')) {
    sizeMB = 3;
  }
  // E-commerce
  else if (domain.includes('amazon') || domain.includes('ebay') || 
           domain.includes('shop') || domain.includes('store')) {
    sizeMB = 5;
  }
  
  return Math.round(sizeMB * 11); // 11g CO2 per MB
}

function updateEmissionLevelIndicator(emissions) {
  const indicator = document.querySelector('.level-indicator');
  const percentage = Math.min((emissions / 500) * 100, 100); // Max at 500g
  
  indicator.style.width = `${percentage}%`;
  
  if (emissions < 50) {
    indicator.className = 'level-indicator';
  } else if (emissions < 150) {
    indicator.className = 'level-indicator medium';
  } else {
    indicator.className = 'level-indicator high';
  }
}

function generateRecommendations(visitedSites) {
  const recommendationsDiv = document.getElementById('recommendations');
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      try {
        const currentDomain = new URL(tabs[0].url).hostname;
        const recommendations = getGreenAlternatives(currentDomain);
        
        if (recommendations.length > 0) {
          recommendationsDiv.innerHTML = recommendations
            .map(rec => `<div class="recommendation-item">${rec}</div>`)
            .join('');
        } else {
          recommendationsDiv.innerHTML = `
            <p>💡 <strong>General Tips:</strong></p>
            <div class="recommendation-item">Close unused tabs to reduce CPU usage</div>
            <div class="recommendation-item">Use ad blockers to reduce data transfer</div>
            <div class="recommendation-item">Choose lower video quality when possible</div>
          `;
        }
      } catch (error) {
        recommendationsDiv.innerHTML = '<p class="loading">Unable to analyze current site</p>';
      }
    }
  });
}

function getGreenAlternatives(domain) {
  const alternatives = [];
  
  // Video alternatives
  if (domain.includes('youtube')) {
    alternatives.push('📺 Consider PeerTube for decentralized video streaming');
    alternatives.push('⚡ Use lower video quality (720p instead of 1080p)');
  }
  
  // Search alternatives
  if (domain.includes('google')) {
    alternatives.push('🔍 Try Ecosia - plants trees with your searches');
    alternatives.push('🦆 Use DuckDuckGo for privacy-focused search');
  }
  
  // Social media alternatives
  if (domain.includes('facebook') || domain.includes('instagram')) {
    alternatives.push('📱 Use mobile apps instead of web browsers');
    alternatives.push('🌿 Consider Mastodon for decentralized social media');
  }
  
  // E-commerce alternatives
  if (domain.includes('amazon')) {
    alternatives.push('🏪 Shop locally when possible');
    alternatives.push('♻️ Consider second-hand options first');
  }
  
  // News alternatives
  if (domain.includes('news')) {
    alternatives.push('📰 Use RSS readers to reduce repeated visits');
    alternatives.push('📱 Try lightweight news apps');
  }
  
  return alternatives;
}

function setupEventListeners() {
  document.getElementById('viewDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/dashboard.html') });
    window.close();
  });
  
  document.getElementById('clearData').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all tracking data?')) {
      await chrome.storage.local.clear();
      
      document.getElementById('totalEmissions').textContent = '0';
      document.getElementById('todayEmissions').textContent = '0';
      
      chrome.runtime.sendMessage({ action: 'clearData' });
      
      alert('Data cleared successfully!');
    }
  });
}