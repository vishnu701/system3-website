/**
 * Shared header component for System3 website
 * This file creates a reusable header that can be included on all pages
 */

// Create and insert the header HTML
function createHeader() {
  // Get the current page path to set active class
  const currentPath = window.location.pathname;
  
  // Use the base URL from baseurl.js if available, otherwise fallback to detection
  const baseUrl = window.siteConfig?.baseUrl || '';
  const isGitHubPages = window.siteConfig?.isGitHubPages || window.location.hostname.includes('github.io');
  
  // Helper to fix URLs for GitHub Pages
  function fixUrl(url) {
    // If it's an external URL or anchor, don't modify it
    if (!url.startsWith('/') || url === '#') {
      return url;
    }
    
    // If on GitHub Pages, ensure HTML extension is present
    if (isGitHubPages) {
      // Use the helper from baseurl.js if available
      if (window.siteConfig?.toHtmlUrl) {
        return window.siteConfig.toHtmlUrl(url);
      }
      
      // Add the base URL
      let fixedUrl = baseUrl ? `${baseUrl}${url}` : url;
      
      // Add .html extension if not present and not ending with /
      if (!fixedUrl.endsWith('.html') && !fixedUrl.endsWith('/')) {
        fixedUrl = fixedUrl + '.html';
      }
      
      return fixedUrl;
    }
    
    // Use the baseUrl to fix paths
    if (baseUrl) {
      return `${baseUrl}${url}`;
    }
    
    return url;
  }
  
  // Create header HTML - use # for home link on the home page to prevent full page reload
  const isHomePage = currentPath === '/' || 
                     currentPath === '/index.html' ||
                     currentPath.endsWith('/index.html');
  
  const homeLink = isHomePage ? '#hero-section' : fixUrl('/');
  
  const headerHTML = `
    <div class="logo">
      <span class="logo-mark"></span>
      <a href="${isHomePage ? '#' : fixUrl('/')}">System3</a>
    </div>
    <nav>
      <ul>
        <li><a href="${homeLink}" ${isHomePage ? 'class="active"' : ''}>Home</a></li>
        <li class="has-dropdown">
          <a href="${fixUrl('/education.html')}" ${currentPath === '/education.html' ? 'class="active"' : ''}>Education</a>
          <ul class="dropdown-menu">
            <li><a href="${fixUrl('/courses/')}" ${currentPath.includes('/courses/') ? 'class="active"' : ''}>Courses</a></li>
          </ul>
        </li>
        <li><a href="${fixUrl('/consultancy.html')}" ${currentPath === '/consultancy.html' ? 'class="active"' : ''}>Consultancy</a></li>
        <li><a href="${fixUrl('/about.html')}" ${currentPath === '/about.html' ? 'class="active"' : ''}>About Us</a></li>
        <li><a href="${fixUrl('/contact.html')}" ${currentPath === '/contact.html' ? 'class="active"' : ''}>Contact</a></li>
      </ul>
    </nav>
    <div class="header-actions">
      <div class="theme-toggle-wrapper">
        <span class="theme-label">Theme</span>
        <div class="theme-toggle" aria-label="Toggle light/dark mode" role="button" tabindex="0">
          <svg class="icon icon-moon" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" stroke-width="2" d="M12 3a9 9 0 1 0 9 9c0-4.97-4.03-9-9-9zm0 0V1m0 22v-2m10-10h2M1 12h2m17-7l-2 2M6 6L4 4m14 14l2 2m-16-2l-2 2"></path>
          </svg>
          <svg class="icon icon-sun" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" stroke-width="2" d="M12 3a9 9 0 1 0 9 9c0-.97-.03-1 0-1 .97 0 2-.97 2-2s-1.03-2-2-2h-2c-.97 0-2-1.03-2-2 0-1.03 1.03-2 2-2"></path>
          </svg>
        </div>
      </div>
      <div class="menu-toggle">
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  // Find the header element and insert the HTML
  const headerElement = document.querySelector('header');
  if (headerElement) {
    headerElement.innerHTML = headerHTML;
  } else {
    console.error('Header element not found');
  }
  
  // Fix navigation dropdowns - prevent them from flashing during navigation
  const navDropdowns = document.querySelectorAll('.dropdown-menu');
  navDropdowns.forEach(dropdown => {
    dropdown.style.transition = 'none'; // Disable transitions initially
    setTimeout(() => {
      dropdown.style.transition = ''; // Re-enable transitions after page load
    }, 500);
  });
  
  // Explicitly mark navigation clicks to prevent loading screen
  const allNavLinks = document.querySelectorAll('nav a, .logo a');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Specially handle links that go to home page
    if (href === '/' || href === '/index.html' || href?.endsWith('/index.html')) {
      link.addEventListener('click', (e) => {
        // Force prevention of loading screen
        localStorage.setItem('skipLoadingScreen', 'true');
        sessionStorage.setItem('skipLoadingScreen', 'true');
        window.isNavigationClick = true;
        
        // Prevent FOUC during navigation
        document.documentElement.classList.add('loading');
      });
    } 
    // Handle all other navigation links
    else if (!href?.includes('#')) {
      link.addEventListener('click', () => {
        // Set global flag to indicate this is a navigation click
        window.isNavigationClick = true;
        
        // Also set localStorage to remember this was a navigation
        localStorage.setItem('navClick', Date.now().toString());
        
        // Prevent FOUC during navigation
        document.documentElement.classList.add('loading');
      });
    }
  });
  
  // On home page, prevent reloads when clicking home links
  if (isHomePage) {
    const homeLinks = document.querySelectorAll('a[href="#hero-section"], a[href="/"], a[href="/index.html"], .logo a');
    homeLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Scroll to top smoothly
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  }
}

// Export the function
export default createHeader;