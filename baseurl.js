// This script detects the base URL for GitHub Pages deployment
(function() {
  // Add to window object for global access
  window.siteConfig = {
    baseUrl: ''
  };
  
  // Check if running on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    // Find the repository name from the URL
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.length > 1 && pathSegments[1]) {
      // Set the base URL to the repository name (e.g. "/repo-name")
      window.siteConfig.baseUrl = '/' + pathSegments[1];
    }
  }
  
  // Add a helper function to fix URLs
  window.siteConfig.fixUrl = function(url) {
    // If it's an absolute path and we're on GitHub Pages, add the base URL
    if (url.startsWith('/') && window.siteConfig.baseUrl) {
      return window.siteConfig.baseUrl + url;
    }
    return url;
  };
  
  console.log('Base URL detected as:', window.siteConfig.baseUrl);
})();