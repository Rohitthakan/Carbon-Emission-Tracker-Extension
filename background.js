// Background script for Carbon Emissions Tracker
let sessionData = {};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    totalEmissions: 0,
    visitedSites: [],
    dailyEmissions: {},
    settings: {
      notifications: true,
      trackingEnabled: true
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    trackPageLoad(tab.url, tabId);
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      trackPageLoad(tab.url, activeInfo.tabId);
    }
  });
});

// Track page load and calculate emissions
async function trackPageLoad(url, tabId) {
  try {
    const domain = new URL(url).hostname;
    const emissions = calculateEmissions(domain, url);
    
    // Store session data
    if (!sessionData[tabId]) {
      sessionData[tabId] = [];
    }
    
    const visitData = {
      domain,
      url,
      emissions,
      timestamp: Date.now()
    };
    
    sessionData[tabId].push(visitData);
    
    // Update storage
    updateEmissionsData(visitData);
    
    // Update badge
    updateBadge(emissions);
    
  } catch (error) {
    console.error('Error tracking page load:', error);
  }
}

// Calculate emissions based on domain and data transfer
function calculateEmissions(domain, url) {
  // Base emission factors (grams CO2 per MB)
  const baseEmissionFactor = 11; // 11g CO2 per MB as mentioned in problem
  
  // Estimate page size based on domain type
  let estimatedSizeMB = getEstimatedPageSize(domain);
  
  // Calculate emissions
  const emissions = estimatedSizeMB * baseEmissionFactor;
  
  return Math.round(emissions * 100) / 100; // Round to 2 decimal places
}

// Estimate page size based on domain characteristics
function getEstimatedPageSize(domain) {
  // Default size estimates (MB)
  let baseSizeMB = 2.5; // Average web page size
  
  // Adjust based on site type
  if (domain.includes('youtube') || domain.includes('netflix') || domain.includes('video')) {
    baseSizeMB = 50; // Video streaming sites
  } else if (domain.includes('instagram') || domain.includes('pinterest') || domain.includes('imgur')) {
    baseSizeMB = 8; // Image-heavy sites
  } else if (domain.includes('google') || domain.includes('search')) {
    baseSizeMB = 1; // Search engines (lightweight)
  } else if (domain.includes('news') || domain.includes('blog')) {
    baseSizeMB = 3; // News/blog sites
  } else if (domain.includes('shop') || domain.includes('amazon') || domain.includes('ebay')) {
    baseSizeMB = 5; // E-commerce sites
  }
  
  return baseSizeMB;
}

// Update emissions data in storage
async function updateEmissionsData(visitData) {
  const result = await chrome.storage.local.get(['totalEmissions', 'visitedSites', 'dailyEmissions']);
  
  const newTotalEmissions = (result.totalEmissions || 0) + visitData.emissions;
  const visitedSites = result.visitedSites || [];
  const dailyEmissions = result.dailyEmissions || {};
  
  // Add to visited sites
  visitedSites.push(visitData);
  
  // Update daily emissions
  const today = new Date().toDateString();
  dailyEmissions[today] = (dailyEmissions[today] || 0) + visitData.emissions;
  
  // Keep only last 100 visits to manage storage
  if (visitedSites.length > 100) {
    visitedSites.splice(0, visitedSites.length - 100);
  }
  
  await chrome.storage.local.set({
    totalEmissions: newTotalEmissions,
    visitedSites,
    dailyEmissions
  });
}

// Update extension badge
function updateBadge(emissions) {
  const badgeText = emissions > 1000 ? '1k+' : emissions.toString();
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: getEmissionColor(emissions) });
}

// Get color based on emission level
function getEmissionColor(emissions) {
  if (emissions < 50) return '#4CAF50'; // Green
  if (emissions < 150) return '#FF9800'; // Orange
  return '#F44336'; // Red
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSessionData') {
    sendResponse({ sessionData });
  } else if (request.action === 'clearData') {
    chrome.storage.local.clear();
    sessionData = {};
    chrome.action.setBadgeText({ text: '' });
    sendResponse({ success: true });
  }
});