// Configuration file for app settings
export const config = {
  // Cloudinary configuration
  cloudinary: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  },
  
  // File upload settings
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf'],
  },
  
  // Firebase configuration
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  },
  
  // App settings
  app: {
    name: 'Certificate Portfolio',
    version: '1.0.0',
  }
};

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const errors = [];
  
  if (!config.cloudinary.cloudName) {
    errors.push('REACT_APP_CLOUDINARY_CLOUD_NAME is not set');
  }
  
  if (!config.cloudinary.uploadPreset) {
    errors.push('REACT_APP_CLOUDINARY_UPLOAD_PRESET is not set');
  }
  
  if (!config.firebase.apiKey) {
    errors.push('REACT_APP_FIREBASE_API_KEY is not set');
  }
  
  if (!config.firebase.projectId) {
    errors.push('REACT_APP_FIREBASE_PROJECT_ID is not set');
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    return false;
  }
  
  return true;
};
