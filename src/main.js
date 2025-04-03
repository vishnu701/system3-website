import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import createHeader from './components/header.js';
import { coursesData } from './data/courses.js';

// Make coursesData available globally
window.coursesData = coursesData;

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Track if this is a page navigation using the home link
window.isNavigationClick = false;

// Set up baseUrl for the application - this is critical for both local and GitHub Pages environments
window.addEventListener('DOMContentLoaded', function() {
  // Detect if we're on GitHub Pages or local development
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  // Get the base URL from the running application
  // Vite adds a global variable import.meta.env.BASE_URL for this
  const detectedBaseUrl = import.meta.env.BASE_URL || '';
  const baseUrl = isGitHubPages ? '/system3-website' : detectedBaseUrl;
  
  // Set up window.siteConfig for baseUrl access
  window.siteConfig = window.siteConfig || {
    baseUrl: baseUrl,
    isGitHubPages: isGitHubPages
  };
  
  console.log('Site config initialized:', window.siteConfig, 'Using BASE_URL:', import.meta.env.BASE_URL);
});

// Function to check if we should show the loading screen (currently disabled)
function isFirstVisit() {
  // Loading screen functionality is currently disabled
  // Keeping the code for future reference
  return false; // Always return false to skip loading screen
}

// Helper function to fix navigation links
function fixNavigationLinks() {
  // First, remove any existing event listeners from navigation links by cloning them
  document.querySelectorAll('nav a, .logo a').forEach(link => {
    const newLink = link.cloneNode(true);
    if (link.parentNode) {
      link.parentNode.replaceChild(newLink, link);
    }
  });
  
  // Make all navigation links explicitly clickable
  document.querySelectorAll('nav a, .logo a').forEach(link => {
    link.style.position = 'relative';
    link.style.zIndex = '2000';
    link.style.pointerEvents = 'auto';
    
    // For links with href="#something", add smooth scrolling
    if (link.getAttribute('href')?.startsWith('#')) {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
  
  // Fix navigation dropdowns - prevent them from flashing during navigation
  const navDropdowns = document.querySelectorAll('.dropdown-menu');
  navDropdowns.forEach(dropdown => {
    dropdown.style.transition = 'none'; // Disable transitions initially
    setTimeout(() => {
      dropdown.style.transition = ''; // Re-enable transitions after page load
    }, 500);
  });
}

// Wait for DOM to be fully loaded and page loaded
// Handle page loading to prevent FOUC
window.addEventListener('load', function() {
  // Remove loading class after everything is fully loaded
  document.documentElement.classList.remove('loading');
  
  // Make sure loading screen is hidden
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
    loadingScreen.style.visibility = 'hidden';
  }
});

// DOM ready - initialize everything directly without loading screen
document.addEventListener('DOMContentLoaded', () => {
  // Immediately remove any loading classes
  document.documentElement.classList.remove('loading');
  document.body.classList.remove('loading');
  
  // Remove any loading screen if it exists
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.parentNode) {
    loadingScreen.parentNode.removeChild(loadingScreen);
  }
  
  // Initialize shared header
  createHeader();
  
  // Initialize application components
  init();
  setupFAQs();
  setupMobileMenu();
  setupThemeToggle();
  setupSectionAnimations();
  
  // Fix navigation links immediately
  fixNavigationLinks();
});

// Initial page load animation (disabled)
function initPageLoadAnimation() {
  // Loading functionality is disabled - this function now just removes any loading classes
  document.documentElement.classList.remove('loading');
  document.body.classList.remove('loading');
  
  // Remove loading screen if it exists
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.parentNode) {
    loadingScreen.parentNode.removeChild(loadingScreen);
  }
}

// Main initialization function
function init() {
  /**
   * Base setup
   */
  // Get the canvas element
  const canvas = document.querySelector('canvas.webgl');
  
  // Only proceed with THREE.js setup if we have a canvas
  if (!canvas) {
    console.log('No canvas found, skipping THREE.js initialization');
    return;
  }
  
  // Create the scene
  const scene = new THREE.Scene();
  
  // Remove loading screen immediately
  document.documentElement.classList.remove('loading');
  document.body.classList.remove('loading');
  
  // Remove any loading screen if it exists
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.parentNode) {
    loadingScreen.parentNode.removeChild(loadingScreen);
  }
  
  /**
   * Create particles
   */
  const particles = createParticles();
  scene.add(particles);
  
  /**
   * Create visual elements
   */
  // Create abstracted neural network
  const neuralNetwork = createNeuralNetwork();
  scene.add(neuralNetwork);
  
  /**
   * Lighting - More subtle, elegant lighting
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  /**
   * Window sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  // Update on window resize
  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  
  /**
   * Camera setup
   */
  // Create a camera
  const camera = new THREE.PerspectiveCamera(28, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(0, 0, 15);
  scene.add(camera);
  
  /**
   * Renderer setup
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050505, 0);
  
  /**
   * Animation loop
   */
  const clock = new THREE.Clock();
  let previousTime = 0;
  
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    
    // Slow rotation of particle system
    particles.rotation.y = elapsedTime * 0.02;
    
    // Subtle neural network animation
    if (neuralNetwork) {
      // Gentle overall rotation
      neuralNetwork.rotation.y = Math.sin(elapsedTime * 0.1) * 0.1;
      neuralNetwork.rotation.x = Math.cos(elapsedTime * 0.15) * 0.05;
      
      // Animate each element in the neural network
      neuralNetwork.children.forEach((child, i) => {
        // For node meshes - floating animation
        if (child.type === 'Mesh') {
          const originalPos = child.userData.originalPosition;
          const offset = child.userData.animationOffset || 0;
          
          // Subtle position animation - floating effect
          child.position.y = originalPos.y + Math.sin(elapsedTime * 0.3 + offset) * 0.08;
          child.position.x = originalPos.x + Math.cos(elapsedTime * 0.4 + offset) * 0.05;
          
          // Subtle pulsing of nodes
          child.scale.setScalar(1 + Math.sin(elapsedTime * 0.5 + offset) * 0.1);
        }
        
        // Update connection lines
        if (child.type === 'Line' && child.userData.startNode && child.userData.endNode) {
          // Update line vertices to match new node positions
          const startNode = child.userData.startNode;
          const endNode = child.userData.endNode;
          
          const points = [
            startNode.position.clone(),
            endNode.position.clone()
          ];
          
          child.geometry.setFromPoints(points);
          child.geometry.attributes.position.needsUpdate = true;
        }
      });
    }
    
    // Render
    renderer.render(scene, camera);
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };
  
  // Start the animation loop
  tick();
}

/**
 * Loading functionality has been disabled
 */
function simulateLoading() {
  // Just a placeholder - we don't show loading screens anymore
  console.log("Loading screen disabled");
  
  // If a loading screen element exists, remove it
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.parentNode) {
    loadingScreen.parentNode.removeChild(loadingScreen);
  }
  
  // Remove loading class from html and body elements
  document.documentElement.classList.remove('loading');
  document.body.classList.remove('loading');
}

/**
 * Creates a particle system for the background
 */
function createParticles() {
  // Simple particle system
  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);
  
  // Create particles with random positions
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  
  // Create the particle geometry
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Create the particle material
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    color: 0xdcdcff,
    transparent: true,
    opacity: 0.15,
    depthWrite: false
  });
  
  // Create the particle system
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  return particles;
}

/**
 * Creates a simple neural network visualization
 */
function createNeuralNetwork() {
  const group = new THREE.Group();
  
  // Create a sparse neural network with fewer neurons
  const nodeCount = 15;
  const nodes = [];
  
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * 8;
    const y = (Math.random() - 0.5) * 8;
    const z = (Math.random() - 0.5) * 8;
    
    const nodeSize = 0.03 + Math.random() * 0.01;
    const nodeGeometry = new THREE.SphereGeometry(nodeSize, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8a85ff,
      transparent: true,
      opacity: 0.6
    });
    
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(x, y, z);
    // Store original position for animation
    node.userData.originalPosition = {x, y, z};
    node.userData.animationOffset = Math.random() * Math.PI * 2; // Random offset for animation
    group.add(node);
    nodes.push(node);
  }
  
  // Create simple connections between nodes - with fewer connections
  for (let i = 0; i < nodes.length; i++) {
    if (Math.random() > 0.5) { // Reduced probability (0.3 -> 0.5)
      const node = nodes[i];
      // Most nodes will have just 1 connection
      const connections = Math.random() > 0.7 ? 2 : 1;
      
      for (let c = 0; c < connections; c++) {
        const target = Math.floor(Math.random() * nodes.length);
        if (target !== i) {
          const otherNode = nodes[target];
          
          const points = [
            node.position.clone(),
            otherNode.position.clone()
          ];
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x8a85ff,
            transparent: true,
            opacity: 0.15
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.userData = {
            startNode: node,
            endNode: otherNode
          };
          group.add(line);
        }
      }
    }
  }
  
  group.position.z = -8;
  return group;
}

/**
 * Sets up animation for hero section only, no scroll-based animations
 */
function setupSectionAnimations() {
  // Make all sections visible immediately
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.visibility = 'visible';
    section.style.opacity = '1';
    section.classList.add('active');
  });
  
  // Helper function to specifically animate hero sections
  function animateHeroSection(section) {
    // Ensure the section is visible
    section.style.visibility = 'visible';
    section.style.opacity = '1';
    
    // Find the hero content
    const heroContent = section.querySelector('.hero-content');
    if (!heroContent) return;
    
    // Clear any existing animations
    gsap.killTweensOf(heroContent);
    gsap.killTweensOf(heroContent.children);
    
    // Ensure visibility
    heroContent.style.visibility = 'visible';
    
    // Set initial state
    gsap.set(heroContent, {
      opacity: 0,
      y: 30
    });
    
    // Main animation for hero content
    gsap.to(heroContent, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      clearProps: "transform,opacity"
    });
    
    // Animate hero title and subtitle separately for stagger effect
    const heroTitle = heroContent.querySelector('h1');
    const heroPara = heroContent.querySelector('p');
    
    if (heroTitle) {
      gsap.fromTo(heroTitle, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
      );
    }
    
    if (heroPara) {
      gsap.fromTo(heroPara, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out", clearProps: "all" }
      );
    }
  }
  
  // Clear any existing ScrollTrigger instances
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
  
  // Find and animate only the hero section, which should be the first section
  if (sections.length > 0) {
    const firstSection = sections[0];
    
    // Only animate hero sections
    if (firstSection.id && (firstSection.id.includes('hero') || firstSection.id === 'consultancy-hero')) {
      animateHeroSection(firstSection);
    }
  }
  
  // Set up navigation links without animations
  const heroNavLinks = document.querySelectorAll('nav a');
  heroNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', (e) => {
        const targetId = href;
        if (targetId === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Update active link
          heroNavLinks.forEach(navLink => navLink.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }
  });
  
  // Animate elements within a section
  function animateSection(section) {
    // Ensure the section is visible
    section.style.visibility = 'visible';
    section.style.opacity = '1';
    
    // Clear any previous animations that might be in progress
    const animatedElements = section.querySelectorAll('.education-card, .consulting-card, .faq-item, h2, .section-description, .section-illustration-container');
    gsap.killTweensOf(animatedElements);
    
    // Set initial state of all animated elements
    // This prevents the "jump down" effect
    gsap.set(animatedElements, {
      opacity: 0,
      y: 20,
      scale: 1
    });
    
    // Staggered animation for education cards
    const educationCards = section.querySelectorAll('.education-card');
    if (educationCards.length) {
      // Set minimum height instead of fixed height
      educationCards.forEach(card => {
        card.style.minHeight = '250px'; // Minimum height that ensures content is visible
        card.style.height = 'auto'; // Allow height to adjust to content
        card.style.visibility = 'visible'; // Make sure the card is visible
      });
      
      gsap.to(educationCards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all" // Clean up after animation completes
      });
    }
    
    // Staggered animation for consulting cards
    const consultingCards = section.querySelectorAll('.consulting-card');
    if (consultingCards.length) {
      // Set minimum height instead of fixed height to allow content to be visible
      consultingCards.forEach(card => {
        card.style.minHeight = '200px'; // Minimum height that ensures content is visible
        card.style.height = 'auto'; // Allow height to adjust to content
        card.style.visibility = 'visible'; // Make sure the card is visible
      });
      
      gsap.to(consultingCards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all" // Clean up after animation completes
      });
    }
    
    // Staggered animation for FAQ items
    const faqItems = section.querySelectorAll('.faq-item');
    if (faqItems.length) {
      faqItems.forEach(item => {
        item.style.visibility = 'visible'; // Make sure the item is visible
      });
      
      gsap.to(faqItems, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all" // Clean up after animation completes
      });
    }
    
    // Animation for section description
    const sectionDesc = section.querySelector('.section-description');
    if (sectionDesc) {
      sectionDesc.style.visibility = 'visible'; // Make sure it's visible
      
      gsap.to(sectionDesc, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        clearProps: "all" // Clean up after animation completes
      });
    }
    
    // Animation for section heading
    const sectionHeading = section.querySelector('h2');
    if (sectionHeading) {
      sectionHeading.style.visibility = 'visible'; // Make sure it's visible
      
      gsap.to(sectionHeading, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        clearProps: "all" // Clean up after animation completes
      });
    }
    
    // Animation for section illustrations
    const sectionIllustrations = section.querySelectorAll('.section-illustration-container');
    if (sectionIllustrations.length) {
      sectionIllustrations.forEach(illustration => {
        illustration.style.visibility = 'visible'; // Make sure it's visible
      });
      
      gsap.to(sectionIllustrations, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        clearProps: "all" // Clean up after animation completes
      });
    }
    
    // Try to find any other grid or card containers to animate
    const otherGrids = section.querySelectorAll('.approach-grid, .courses-grid, .instructors-grid, .values-grid, .team-grid, .team-leaders, .case-studies-grid, .services-grid');
    otherGrids.forEach(grid => {
      const items = grid.children;
      if (items.length) {
        // Use minimum height to ensure content visibility
        Array.from(items).forEach(item => {
          item.style.minHeight = '200px'; // Minimum height
          item.style.height = 'auto'; // Allow height to adjust to content
          item.style.visibility = 'visible'; // Make sure it's visible
        });
        
        gsap.set(items, { opacity: 0, y: 20, scale: 1 });
        gsap.to(items, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          clearProps: "all" // Clean up after animation completes
        });
      }
    });
  }
  
  // Very simple function to update active navigation
  function updateActiveNavLink(sectionId) {
    const sectionNavLinks = document.querySelectorAll('nav a');
    sectionNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Minimal click handlers for navigation - REMOVED to avoid duplicate event listeners
  // This functionality is already handled above
  
  // Simple scroll indicator 
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    // Hide scroll indicator when user scrolls
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
      } else {
        scrollIndicator.style.opacity = '1';
      }
    });
  }
}

/**
 * Sets up FAQ accordion functionality
 */
function setupFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      // Check if the item is active
      const isActive = item.classList.contains('active');
      
      // Close all FAQs
      faqItems.forEach(faq => {
        faq.classList.remove('active');
        const faqAnswer = faq.querySelector('.faq-answer');
        faqAnswer.style.display = 'none';
      });
      
      // If it wasn't active, open this one
      if (!isActive) {
        item.classList.add('active');
        answer.style.display = 'block';
      }
    });
  });
}

/**
 * Sets up mobile menu toggle functionality
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
  
  // Close menu when clicking on a link
  const mobileNavLinks = document.querySelectorAll('nav a');
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });
}

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
  // Simple smooth scrolling - only for anchor links within the page
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only prevent default for links that point to an ID on the current page
      const targetId = link.getAttribute('href');
      
      // Check if this is a same-page anchor link (not an external link)
      if (targetId !== '#' && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  
  // Fix: Add explicit click handler for non-anchor links in the header
  const externalNavLinks = document.querySelectorAll('nav a:not([href^="#"])');
  externalNavLinks.forEach(link => {
    link.style.pointerEvents = 'auto'; // Ensure pointer events are enabled
    
    // Clear any existing event listeners
    const oldLink = link.cloneNode(true);
    link.parentNode.replaceChild(oldLink, link);
  });
}

/**
 * Sets up theme toggle functionality
 */
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return; // Exit if theme toggle doesn't exist
  
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use the system preference
  const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
  
  // Set initial theme
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  // Remove any existing event listeners by cloning
  const newThemeToggle = themeToggle.cloneNode(true);
  themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
  
  // Toggle theme when button is clicked
  newThemeToggle.addEventListener('click', () => {
    let theme;
    
    // Toggle between light and dark themes
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      document.documentElement.removeAttribute('data-theme');
      theme = 'dark';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      theme = 'light';
    }
    
    // Save the preference
    localStorage.setItem('theme', theme);
  });
}