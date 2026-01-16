// API Configuration
// In development: uses proxy from package.json (http://127.0.0.1:5050)
// In production: uses REACT_APP_API_URL environment variable

const API_URL = process.env.REACT_APP_API_URL || '';

export default API_URL;
