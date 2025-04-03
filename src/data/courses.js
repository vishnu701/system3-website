/**
 * Centralized courses data repository
 * This file contains all course information used across the site
 */

export const coursesData = {
  // High School level courses
  highSchool: [
    {
      id: 'data-science',
      title: 'Bedrock Data Science',
      description: 'Master the fundamentals of data analysis, statistics, and visualization needed to build a strong AI foundation.',
      longDescription: 'Master the fundamentals of data analysis, statistics, and visualization needed to build a strong AI foundation. This course teaches Python basics, data manipulation, statistical analysis, and visualization techniques.',
      iconLight: '/src/assets/images/data-science-icon-light.svg',
      iconDark: '/src/assets/images/data-science-icon-dark.svg',
      imagePath: '/public/course-data-science.jpg',
      link: '/courses/data-science.html',
      featured: true
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      description: 'Explore supervised and unsupervised learning techniques to build intelligent systems that learn from data.',
      longDescription: 'Explore supervised and unsupervised learning techniques to build intelligent systems that learn from data. Learn about classification, regression, clustering, and the mathematics behind machine learning algorithms.',
      iconLight: '/src/assets/images/machine-learning-icon-light.svg',
      iconDark: '/src/assets/images/machine-learning-icon-dark.svg',
      imagePath: '/public/course-ml.jpg',
      link: '/courses/machine-learning.html',
      featured: true
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision',
      description: 'Develop expertise in image processing, object detection, and neural networks for visual computing systems.',
      longDescription: 'Develop expertise in image processing, object detection, and neural networks for visual computing systems. Build projects involving image classification, object recognition, and feature extraction.',
      iconLight: '/src/assets/images/computer-vision-icon-light.svg',
      iconDark: '/src/assets/images/computer-vision-icon-dark.svg',
      imagePath: '/public/course-cv.jpg',
      link: '/courses/computer-vision.html',
      featured: true
    }
  ],
  
  // Graduate & Corporate level courses
  graduate: [
    {
      id: 'data-science-grad',
      title: 'Bedrock Data Science',
      description: 'Advanced data analysis methodologies with focus on professional applications and industry-standard tools.',
      longDescription: 'Advanced data analysis methodologies with focus on professional applications and industry-standard tools. Learn enterprise-level data processing, advanced statistical methods, and production data pipelines.',
      iconLight: '/src/assets/images/data-science-icon-light.svg',
      iconDark: '/src/assets/images/data-science-icon-dark.svg',
      imagePath: '/public/course-data-science.jpg',
      link: '/courses/graduate-data-science.html',
      featured: true,
      plusBadge: true
    },
    {
      id: 'machine-learning-grad',
      title: 'Machine Learning',
      description: 'Enterprise-ready machine learning solutions with implementation strategies for complex business problems.',
      longDescription: 'Enterprise-ready machine learning solutions with implementation strategies for complex business problems. Focus on scalable ML systems, model deployment, monitoring, and advanced algorithms.',
      iconLight: '/src/assets/images/machine-learning-icon-light.svg',
      iconDark: '/src/assets/images/machine-learning-icon-dark.svg',
      imagePath: '/public/course-ml.jpg',
      link: '/courses/graduate-machine-learning.html',
      featured: true,
      plusBadge: true
    },
    {
      id: 'computer-vision-grad',
      title: 'Computer Vision',
      description: 'Professional-grade computer vision techniques for production environments and scalable solutions.',
      longDescription: 'Professional-grade computer vision techniques for production environments and scalable solutions. Covers deep learning for vision, deployment strategies, and real-time vision systems.',
      iconLight: '/src/assets/images/computer-vision-icon-light.svg',
      iconDark: '/src/assets/images/computer-vision-icon-dark.svg',
      imagePath: '/public/course-cv.jpg',
      link: '/courses/graduate-computer-vision.html',
      featured: true,
      plusBadge: true
    },
    {
      id: 'nlp',
      title: 'Natural Language Processing',
      description: 'Master advanced techniques for text analysis, language understanding, and building sophisticated NLP applications.',
      longDescription: 'Master advanced techniques for text analysis, language understanding, and building sophisticated NLP applications. Explore transformers, BERT, language models, and production deployment.',
      iconLight: '/src/assets/images/nlp-icon-light.svg',
      iconDark: '/src/assets/images/nlp-icon-dark.svg',
      imagePath: '/public/course-nlp.jpg',
      link: '/courses/graduate-nlp.html',
      featured: false,
      plusBadge: true
    },
    {
      id: 'reinforcement-learning',
      title: 'Reinforcement Learning',
      description: 'Design and implement autonomous decision-making systems using advanced reinforcement learning algorithms.',
      longDescription: 'Design and implement autonomous decision-making systems using advanced reinforcement learning algorithms. Learn about policy gradients, deep Q-learning, and practical applications.',
      iconLight: '/src/assets/images/reinforcement-learning-icon-light.svg',
      iconDark: '/src/assets/images/reinforcement-learning-icon-dark.svg',
      imagePath: '/public/course-rl.jpg',
      link: '/courses/graduate-reinforcement-learning.html',
      featured: false,
      plusBadge: true
    },
    {
      id: 'llmops',
      title: 'LLMOps',
      description: 'Learn the operational aspects of deploying, monitoring, and maintaining large language models at scale.',
      longDescription: 'Learn the operational aspects of deploying, monitoring, and maintaining large language models at scale. Focus on fine-tuning, prompt engineering, and enterprise LLM infrastructure.',
      iconLight: '/src/assets/images/llmops-icon-light.svg',
      iconDark: '/src/assets/images/llmops-icon-dark.svg',
      imagePath: '/public/course-llmops.jpg',
      link: '/courses/graduate-llmops.html',
      featured: false,
      plusBadge: true
    }
  ],
  
  /**
   * Helper function to get featured courses (first 3) for a specific level
   * @param {string} level - 'highSchool' or 'graduate'
   * @param {number} limit - Number of courses to return (default: 3)
   * @returns {Array} - Array of course objects
   */
  getFeaturedCourses: function(level, limit = 3) {
    if (!this[level]) return [];
    // Sort by featured status and return the first "limit" courses
    return this[level]
      .filter(course => course.featured)
      .slice(0, limit);
  },
  
  /**
   * Get all courses for a level
   * @param {string} level - 'highSchool' or 'graduate'
   * @returns {Array} - Array of all course objects for the level
   */
  getAllCourses: function(level) {
    return this[level] || [];
  },
  
  /**
   * Get a specific course by ID
   * @param {string} courseId - The course ID to find
   * @returns {Object|null} - The course object or null if not found
   */
  getCourseById: function(courseId) {
    // Search in both high school and graduate levels
    const allCourses = [...this.highSchool, ...this.graduate];
    return allCourses.find(course => course.id === courseId) || null;
  }
};