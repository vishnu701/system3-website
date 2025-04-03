import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { coursesData } from '../src/data/courses.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme toggle
  setupThemeToggle();
  
  // Initialize course curriculum accordions if on a course page
  setupModuleAccordions();
  
  // Initialize course level tabs
  setupCourseLevelTabs();
  
  // Check URL for section hash and activate corresponding tab
  activateTabFromURL();
  
  // Initialize the fixed header for course pages
  setupCourseNav();
  
  // Initialize the sticky hero
  setupStickyHero();
  
  // Initialize mobile menu toggle
  setupMobileMenu();
  
  // Setup smooth scrolling for navigation links
  setupSmoothScrolling();
  
  // Setup animated elements
  setupAnimations();
});

/**
 * Sets up the fixed header navigation for course pages
 */
function setupCourseNav() {
  const courseNav = document.querySelector('.course-nav');
  
  if (courseNav) {
    const courseHero = document.querySelector('.course-hero');
    
    if (courseHero) {
      // Create scroll trigger for the fixed course navigation
      ScrollTrigger.create({
        trigger: courseHero,
        start: "bottom top+=80",
        onEnter: () => {
          courseNav.classList.add('visible');
        },
        onLeaveBack: () => {
          courseNav.classList.remove('visible');
        }
      });
    }
    
    // Highlight active section in the course navigation
    const sections = document.querySelectorAll('.course-section');
    const navLinks = document.querySelectorAll('.course-nav-links a');
    
    if (sections.length > 0 && navLinks.length > 0) {
      // Use plain JavaScript for checking active section
      window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY;
        const headerOffset = 100; // Adjust based on your header height
        
        // Find the current section
        sections.forEach(section => {
          const sectionTop = section.offsetTop - headerOffset;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });
        
        // Update active class
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      });
      
      // Set initial active link based on current position
      window.dispatchEvent(new Event('scroll'));
    }
  }
}

/**
 * Sets up expandable module accordion functionality for course curriculum
 */
function setupModuleAccordions() {
  const moduleItems = document.querySelectorAll('.module-item');
  
  moduleItems.forEach((item) => {
    const moduleHead = item.querySelector('.module-head');
    const moduleContent = item.querySelector('.module-content');
    
    if (moduleHead && moduleContent) {
      moduleHead.addEventListener('click', () => {
        // Toggle the active class
        const isActive = item.classList.contains('active');
        
        // Close all modules
        moduleItems.forEach((module) => {
          module.classList.remove('active');
        });
        
        // If it wasn't active, open this one
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/**
 * Sets up theme toggle functionality
 */
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return; // Exit if theme toggle doesn't exist
  
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use system preference
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

/**
 * Sets up mobile menu toggle functionality
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }
}

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if href is just # or link goes to another page
      if (!href || href === '#' || href.includes('/')) return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        const navHeight = document.querySelector('header').offsetHeight;
        const courseNavHeight = document.querySelector('.course-nav')?.offsetHeight || 0;
        const offset = navHeight + courseNavHeight;
        
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Sets up animations for the hero section
 */
function setupStickyHero() {
  // No longer need sticky functionality, but keeping the function for compatibility
  // Now just handles any animations needed for the hero section
  
  const mainHero = document.querySelector('.courses-header');
  
  if (mainHero) {
    // Add a subtle parallax effect to the hero
    ScrollTrigger.create({
      trigger: mainHero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        gsap.set(mainHero.querySelector('.section-overlay'), {
          opacity: 0.3 + (scrollProgress * 0.3) // Subtle opacity change while scrolling
        });
      }
    });
  }
}

/**
 * Sets up course level tabs for switching between high school and graduate courses
 */
function setupCourseLevelTabs() {
  const tabs = document.querySelectorAll('.level-tab');
  const courseGrids = {
    'high-school': document.getElementById('high-school-courses'),
    'graduate': document.getElementById('graduate-courses')
  };
  
  if (tabs.length === 0 || !courseGrids['high-school'] || !courseGrids['graduate']) {
    return; // Exit if tabs or grids don't exist
  }
  
  // Populate course grids with data from coursesData
  populateCourseGrids();
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all course grids
      Object.values(courseGrids).forEach(grid => {
        if (grid) {
          grid.classList.remove('active');
        }
      });
      
      // Show selected course grid
      const level = tab.dataset.level;
      if (courseGrids[level]) {
        courseGrids[level].classList.add('active');
        
        // Animate the cards in the newly active grid
        const courseCards = courseGrids[level].querySelectorAll('.course-card');
        gsap.fromTo(courseCards, 
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: "power2.out"
          }
        );
      }
    });
  });
}

/**
 * Populates course grids with data from the central coursesData repository
 */
function populateCourseGrids() {
  const highSchoolGrid = document.getElementById('high-school-courses');
  const graduateGrid = document.getElementById('graduate-courses');
  
  if (!highSchoolGrid || !graduateGrid) return;
  
  // Clear existing content
  highSchoolGrid.innerHTML = '';
  graduateGrid.innerHTML = '';
  
  // Populate high school courses
  const highSchoolCourses = coursesData.getAllCourses('highSchool');
  highSchoolCourses.forEach(course => {
    const courseCard = createCourseCard(course);
    highSchoolGrid.appendChild(courseCard);
  });
  
  // Populate graduate courses
  const graduateCourses = coursesData.getAllCourses('graduate');
  graduateCourses.forEach(course => {
    const courseCard = createCourseCard(course);
    graduateGrid.appendChild(courseCard);
  });
}

/**
 * Creates a course card element from course data
 * @param {Object} course - The course data object
 * @returns {HTMLElement} - The course card element
 */
function createCourseCard(course) {
  const courseCard = document.createElement('div');
  courseCard.className = 'course-card';
  courseCard.setAttribute('data-course', course.id);
  
  // Add plus badge for graduate courses if applicable
  const titleHtml = course.plusBadge 
    ? `${course.title}<span class="plus">+</span>` 
    : course.title;
  
  courseCard.innerHTML = `
    <div class="course-image">
      <img src="${course.iconLight}" alt="${course.title}" width="90" height="90" class="light-mode-icon" />
      <img src="${course.iconDark}" alt="${course.title}" width="90" height="90" class="dark-mode-icon" />
    </div>
    <div class="course-content">
      <h3>${titleHtml}</h3>
      <p>${course.description}</p>
      <a href="${course.link}" class="course-link">Learn More</a>
    </div>
  `;
  
  return courseCard;
}

/**
 * Activates the appropriate course level tab based on localStorage
 */
function activateTabFromURL() {
  // Check localStorage for stored tab preference
  const storedTabLevel = localStorage.getItem('selectedCourseTab');
  
  if (storedTabLevel === 'high-school' || storedTabLevel === 'graduate') {
    // Wait for DOM to be fully loaded
    setTimeout(() => {
      const tabs = document.querySelectorAll('.level-tab');
      const courseGrids = {
        'high-school': document.getElementById('high-school-courses'),
        'graduate': document.getElementById('graduate-courses')
      };
      
      if (tabs.length > 0 && courseGrids[storedTabLevel]) {
        // Find the correct tab by data-level attribute
        const targetTab = Array.from(tabs).find(tab => tab.getAttribute('data-level') === storedTabLevel);
        
        if (targetTab) {
          // Silently update tab and grid state without scrolling
          tabs.forEach(tab => tab.classList.remove('active'));
          targetTab.classList.add('active');
          
          Object.values(courseGrids).forEach(grid => {
            if (grid) grid.classList.remove('active');
          });
          
          courseGrids[storedTabLevel].classList.add('active');
        }
      }
    }, 100); // Short delay to ensure DOM is ready
  }
}

/**
 * Sets up animations for page elements using GSAP
 */
function setupAnimations() {
  // Animate the courses header - enhanced animations
  const coursesHeader = document.querySelector('.courses-header');
  if (coursesHeader) {
    const headerContent = coursesHeader.querySelector('.section-content');
    const headerTitle = headerContent.querySelector('h1');
    const headerDesc = headerContent.querySelector('.section-description');
    
    // Create a timeline for more coordinated animations
    const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Set initial state
    gsap.set([headerTitle, headerDesc], { opacity: 0, y: 30 });
    
    // Animate title with a slight reveal effect
    headerTl.to(headerTitle, { 
      y: 0, 
      opacity: 1, 
      duration: 1,
      ease: "power2.out"
    });
    
    // Animate description with staggered reveal
    if (headerDesc) {
      headerTl.to(headerDesc, {
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6"); // Overlap with previous animation
    }
    
    // Add a subtle scale to the entire content
    headerTl.from(headerContent, {
      scale: 0.98,
      duration: 1.2,
      ease: "power1.out"
    }, 0); // Start at the same time as first animation
  }
  
  // Animate course cards with enhanced animations
  const activeGrid = document.querySelector('.courses-grid.active');
  const courseCards = activeGrid ? activeGrid.querySelectorAll('.course-card') : document.querySelectorAll('.course-card');
  
  if (courseCards.length) {
    // No need to set uniform height - let them be flexible for better responsive design
    
    // Create a staggered entrance animation
    gsap.set(courseCards, { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    });
    
    // Create scroll trigger for each card
    courseCards.forEach((card, index) => {
      // Staggered animation based on index
      gsap.to(card, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        delay: index * 0.1, // Staggered delay
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%", // Trigger when card is 85% into viewport
          toggleActions: "play none none none" // Play animation once when scrolled into view
        }
      });
      
      // Add subtle hover animations for images and other elements
      const cardImage = card.querySelector('.course-image img');
      if (cardImage) {
        gsap.set(cardImage, { 
          scale: 1,
          y: 0,
          duration: 0.4, 
          ease: "power2.out" 
        });
      }
    });
  }
  
  // Animate approach items
  const approachItems = document.querySelectorAll('.approach-item');
  if (approachItems.length) {
    // Remove height normalization for better responsiveness
    approachItems.forEach(item => {
      item.style.height = 'auto';
    });
    
    // Set initial state
    gsap.set(approachItems, { opacity: 0, y: 20 });
    
    gsap.to(approachItems, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.approach-grid',
        start: "top 75%"
      }
    });
  }
  
  // Animate any section headings and descriptions
  const sectionHeadings = document.querySelectorAll('.section h2');
  sectionHeadings.forEach(heading => {
    if (heading.closest('.courses-header')) return; // Skip the header we already animated
    
    // Set initial state
    gsap.set(heading, { opacity: 0, y: 20 });
    
    gsap.to(heading, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 80%"
      }
    });
    
    // Look for description after this heading
    const description = heading.nextElementSibling;
    if (description && description.classList.contains('section-description')) {
      // Set initial state
      gsap.set(description, { opacity: 0, y: 20 });
      
      gsap.to(description, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: description,
          start: "top 80%"
        }
      });
    }
  });
  
  // Animate CTA section
  const ctaSection = document.querySelector('.cta-section');
  if (ctaSection) {
    const ctaContent = ctaSection.querySelector('.section-content');
    
    // Set initial state
    gsap.set(ctaContent.children, { opacity: 0, y: 20 });
    
    gsap.to(ctaContent.children, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ctaSection,
        start: "top 75%"
      }
    });
  }
}