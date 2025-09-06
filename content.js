(function() {
  'use strict';
  
  let pageLoadStartTime = performance.now();
  let dataTransferred = 0;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.transferSize) {
        dataTransferred += entry.transferSize;
      }
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });

  window.addEventListener('beforeunload', () => {
    const loadTime = performance.now() - pageLoadStartTime;
    const dataInMB = dataTransferred / (1024 * 1024);
    
    chrome.runtime.sendMessage({
      action: 'updateDataTransfer',
      data: {
        url: window.location.href,
        dataTransferred: dataInMB,
        loadTime: loadTime
      }
    });
  });
  
  function injectEmissionIndicator() {
    if (document.getElementById('carbon-emission-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'carbon-emission-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      display: none;
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      const emissions = estimatePageEmissions();
      indicator.textContent = `~${emissions}g CO₂`;
      indicator.style.display = 'block';
      
      setTimeout(() => {
        indicator.style.display = 'none';
      }, 3000);
    }, 1000);
  }
  
  function estimatePageEmissions() {
    const domain = window.location.hostname;
    let sizeMB = 2.5; 
    
    if (domain.includes('youtube') || domain.includes('video')) sizeMB = 50;
    else if (domain.includes('instagram') || domain.includes('pinterest')) sizeMB = 8;
    else if (domain.includes('google')) sizeMB = 1;
    
    return Math.round(sizeMB * 11);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectEmissionIndicator);
  } else {
    injectEmissionIndicator();
  }
})();