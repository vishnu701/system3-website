// Load Form.io script dynamically to ensure it's properly loaded before initialization
document.addEventListener('DOMContentLoaded', function() {
  // First, make all sections visible
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('active');
  });
  
  // Set up tab switching functionality
  setupTabs();
  
  // Load Form.io script
  loadFormioScript();
});

// Setup tabs functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab
      button.classList.add('active');
      const tabName = button.getAttribute('data-tab');
      document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
    });
  });
}

// Load Form.io script
function loadFormioScript() {
  // Check if Form.io script already exists
  if (typeof Formio \!== 'undefined') {
    console.log('Form.io already loaded');
    initializeFormBuilder();
    return;
  }
  
  console.log('Loading Form.io script...');
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/formiojs@4.13.0/dist/formio.full.min.js';
  script.async = true;
  
  script.onload = function() {
    console.log('Form.io script loaded successfully');
    setTimeout(initializeFormBuilder, 500);
  };
  
  script.onerror = function() {
    console.error('Failed to load Form.io script');
  };
  
  document.body.appendChild(script);
}

// Initialize the form builder
function initializeFormBuilder() {
  console.log('Initializing Form Builder...');
  
  // Check if Formio is loaded
  if (typeof Formio === 'undefined') {
    console.warn('Formio not loaded yet, retrying in 1000ms...');
    setTimeout(initializeFormBuilder, 1000);
    return;
  }
  
  // Get the form elements
  const builder = document.getElementById('formio-builder');
  const preview = document.getElementById('formio-preview');
  const embedCodeDisplay = document.getElementById('embed-code-display');
  const copyButton = document.getElementById('copy-embed-code');
  const saveFormButton = document.getElementById('save-form-json');
  const loadFormButton = document.getElementById('load-form-json');
  const loadFormInput = document.getElementById('load-form-input');
  
  if (\!builder) {
    console.error('Form builder container not found\!');
    return;
  }
  
  // Default form configuration
  const defaultForm = {
    components: [],
    display: 'form',
    settings: {
      customCSS: `.formio-form {
        font-family: 'Inter', sans-serif;
        color: #ffffff;
      }
      .formio-component-submit button {
        background-color: #8a85ff;
        border-color: #8a85ff;
        border-radius: 6px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      .formio-component-submit button:hover {
        background-color: #7a75ef;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(138, 133, 255, 0.2);
      }
      [data-theme="light"] .formio-form {
        color: #333;
      }`
    }
  };
  
  // Initialize the form builder
  Formio.builder(builder, defaultForm, {
    builder: {
      basic: true,
      advanced: false,
      data: true,
      layout: true,
      customBasic: false,
      premium: false
    }
  }).then(function(formbuilder) {
    console.log('Form builder initialized successfully\!');
    window.formbuilder = formbuilder;
    
    // When the form changes, update preview and embed code
    formbuilder.on('change', function(form) {
      updateFormPreview(form);
      updateEmbedCode(form);
    });
    
    // Initialize preview and embed code
    updateFormPreview(defaultForm);
    updateEmbedCode(defaultForm);
  }).catch(function(error) {
    console.error('Form builder initialization failed:', error);
  });
  
  // Update form preview
  function updateFormPreview(form) {
    preview.innerHTML = '';
    Formio.createForm(preview, form).then(function(previewForm) {
      previewForm.on('submit', function(submission) {
        alert('Form submitted successfully\! Check console for data.');
        console.log('Form submission:', submission.data);
        return false;
      });
    });
  }
  
  // Update embed code
  function updateEmbedCode(form) {
    const formJson = JSON.stringify(form, null, 2);
    const embedCode = `<\!-- System3 Form Embed -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/formiojs@4.13.0/dist/formio.full.min.css">
<script src="https://cdn.jsdelivr.net/npm/formiojs@4.13.0/dist/formio.full.min.js"></script>

<div id="formio-form-container"></div>

<script>
  // Form definition
  const formDefinition = ${formJson};
  
  // Render the form
  Formio.createForm(document.getElementById('formio-form-container'), formDefinition)
    .then(function(form) {
      // Handle form submission
      form.on('submit', function(submission) {
        // Save form submission
        console.log('Form submission:', submission.data);
        alert('Form submitted successfully\!');
        return false;
      });
    });
</script>`;
    
    embedCodeDisplay.textContent = embedCode;
  }
  
  // Copy embed code
  copyButton.addEventListener('click', function() {
    const textArea = document.createElement('textarea');
    textArea.value = embedCodeDisplay.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    copyButton.textContent = 'Copied\!';
    setTimeout(function() {
      copyButton.textContent = 'Copy Code';
    }, 2000);
  });
  
  // Save form JSON
  saveFormButton.addEventListener('click', function() {
    if (\!window.formbuilder || \!window.formbuilder.schema) {
      alert('No form has been created yet');
      return;
    }
    
    const formJson = JSON.stringify(window.formbuilder.schema, null, 2);
    const blob = new Blob([formJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system3-form.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
  
  // Load form JSON
  loadFormButton.addEventListener('click', function() {
    loadFormInput.click();
  });
  
  loadFormInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const formSchema = JSON.parse(e.target.result);
          window.formbuilder.setForm(formSchema);
          loadFormInput.value = '';
        } catch (error) {
          alert('Invalid form definition file. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  });
}

// Try again on window load as a fallback
window.addEventListener('load', function() {
  console.log('Window loaded');
  if (typeof Formio === 'undefined') {
    console.log('Formio not loaded on window load, loading script...');
    loadFormioScript();
  } else if (typeof window.formbuilder === 'undefined') {
    console.log('Formio loaded but form builder not initialized, initializing...');
    setTimeout(initializeFormBuilder, 500);
  }
});
