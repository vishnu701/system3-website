// This script detects the base URL for GitHub Pages deployment
(function() {
  // Add to window object for global access
  window.siteConfig = {
    baseUrl: '',
    isGitHubPages: false,
    repoName: ''
  };
  
  // Check if running on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    window.siteConfig.isGitHubPages = true;
    
    // Find the repository name from the URL
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.length > 1 && pathSegments[1]) {
      // Set the repo name (e.g. "system3-website")
      window.siteConfig.repoName = pathSegments[1];
      // Set the base URL with leading slash (e.g. "/system3-website")
      window.siteConfig.baseUrl = '/' + pathSegments[1];
    }
  }
  
  // Add function to fix resource URLs (CSS, JS, images)
  window.siteConfig.fixResourceUrl = function(url) {
    // If already an absolute URL, don't change it
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    
    // If on GitHub Pages and url starts without the repo name, add it
    if (window.siteConfig.isGitHubPages && window.siteConfig.repoName) {
      // If URL already starts with the repo name, don't change it
      if (url.indexOf('/' + window.siteConfig.repoName + '/') === 0) {
        return url;
      }
      
      // If URL starts with slash, add repo name after the slash
      if (url.startsWith('/')) {
        return '/' + window.siteConfig.repoName + url;
      }
      
      // URL doesn't start with slash, add repo name with slash
      return '/' + window.siteConfig.repoName + '/' + url;
    }
    
    return url;
  };
  
  // Patch all resource links on the page after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    if (!window.siteConfig.isGitHubPages) {
      return; // Only run on GitHub Pages
    }
    
    // Fix CSS links
    document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
      const href = link.getAttribute('href');
      if (href) {
        link.setAttribute('href', window.siteConfig.fixResourceUrl(href));
      }
    });
    
    // Fix script src attributes
    document.querySelectorAll('script[src]').forEach(function(script) {
      const src = script.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('//')) {
        script.setAttribute('src', window.siteConfig.fixResourceUrl(src));
      }
    });
    
    // Fix images
    document.querySelectorAll('img[src]').forEach(function(img) {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
        img.setAttribute('src', window.siteConfig.fixResourceUrl(src));
      }
    });
    
    // Add a global error handler for images
    window.addEventListener('error', function(event) {
      const target = event.target;
      
      // Only handle image errors
      if (target && target.tagName === 'IMG' && target.src && target.src.indexOf('/system3-website/') < 0) {
        console.log('Fixing broken image URL:', target.src);
        // Try fixing the path by adding system3-website
        const newSrc = window.siteConfig.fixResourceUrl(target.getAttribute('src'));
        if (newSrc !== target.src) {
          target.src = newSrc;
        }
      }
    }, true);
  });
  
  console.log('Base URL detected as:', window.siteConfig.baseUrl);
  console.log('GitHub Pages:', window.siteConfig.isGitHubPages);
  console.log('Repository name:', window.siteConfig.repoName);
})();