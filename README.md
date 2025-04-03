# System3 - AI Education & Consulting Website

A modern, minimalistic website for System3, an AI education and consulting company. Built with a focus on high-quality animations, subtle interactions, and immersive 3D visuals.

## Features

- Responsive design that works well on all devices
- Minimalistic and elegant user interface
- 3D interactive backgrounds using Three.js
- Smooth animations and transitions with GSAP
- Clean code structure and modern development practices

## Technologies Used

- HTML5, CSS3, and JavaScript
- Three.js for 3D visualizations
- GSAP for animations
- Vite as the build tool

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Workflow Overview

1. **CI Pipeline**: Builds and tests the project on every push to `develop` and `main` branches
2. **Staging Deployment**: Automatically deploys to the staging environment when changes are pushed to the `develop` branch
3. **Production Deployment**: 
   - Automatically triggers when changes are pushed to the `main` branch
   - Can be manually triggered with approval for deploying from staging to production
4. **Hostinger Deployment**: Manual workflow for deploying to Hostinger hosting

### GitHub Environments

- **Staging**: https://[your-username].github.io/System3-Redesign/staging/
- **Production**: https://[your-username].github.io/System3-Redesign/production/

### Setting up the repository

1. Initialize a Git repository in this folder:
   ```
   git init
   ```

2. Create and push to the `develop` branch:
   ```
   git checkout -b develop
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[your-username]/System3-Redesign.git
   git push -u origin develop
   ```

3. Add the required secrets in GitHub repository settings:
   - For Hostinger deployment:
     - `HOSTINGER_USER`: Your Hostinger FTP username
     - `HOSTINGER_PASSWORD`: Your Hostinger FTP password
     - `HOSTINGER_HOST`: Your Hostinger FTP host (e.g., ftp.yourdomain.com)
     - `HOSTINGER_STAGING_PATH`: Path to staging directory on Hostinger
     - `HOSTINGER_PROD_PATH`: Path to production directory on Hostinger

### Development Workflow

1. Work on feature branches branched from `develop`
2. Submit pull requests to the `develop` branch
3. After testing in staging, merge `develop` into `main` for production deployment
4. Alternatively, use the manual workflow dispatch to deploy to production

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

- `src/` - Source code
  - `assets/` - Images, fonts and other assets
  - `components/` - JavaScript components
  - `style.css` - Global styles
  - `main.js` - Application entry point
- `public/` - Static files that should not be processed by Vite
- `index.html` - Main HTML file

## License

All rights reserved.# system3-website
