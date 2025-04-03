// This script fixes the paths for GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    // Find all <link> tags for stylesheets and fix their paths
    document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('src/')) {
        console.log('Fixing CSS link:', href);
        
        // Try fetching from assets directory instead
        const newHref = href.replace('src/', 'assets/');
        
        // Create a new link element with the correct path
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = newHref;
        
        // Replace the old link with the new one
        link.parentNode.replaceChild(newLink, link);
      }
    });
    
    // Find all script tags and fix their paths
    document.querySelectorAll('script[src]').forEach(function(script) {
      const src = script.getAttribute('src');
      if (src && src.startsWith('src/')) {
        console.log('Fixing script src:', src);
        
        // Try fetching from assets directory instead
        const newSrc = src.replace('src/', 'assets/');
        
        // Create a new script element with the correct path
        const newScript = document.createElement('script');
        newScript.type = script.type || 'text/javascript';
        newScript.src = newSrc;
        
        // Replace the old script with the new one
        script.parentNode.replaceChild(newScript, script);
      }
    });
    
    // Fix image paths
    document.querySelectorAll('img[src]').forEach(function(img) {
      const src = img.getAttribute('src');
      if (src && src.includes('/src/')) {
        console.log('Fixing image src:', src);
        
        // Try fetching from assets directory instead
        const newSrc = src.replace('/src/', '/assets/');
        img.setAttribute('src', newSrc);
      }
    });
  }
});