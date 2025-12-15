// Get both endpoints from Vite environment
const API_DOMAIN = import.meta.env.VITE_API_GATEWAY_DOMAIN;
const API_LOCAL = import.meta.env.VITE_API_GATEWAY_LOCAL;
const IMAGE_DOMAIN = import.meta.env.VITE_IMAGE_GATEWAY_DOMAIN;
const IMAGE_LOCAL = import.meta.env.VITE_IMAGE_GATEWAY_LOCAL;

// Detect current host
const host = window.location.hostname; // e.g., "hms.tbhsd.gov.bd" or "192.168.20.222"

// Pick backend API dynamically
export const API_GATEWAY_URL = host === 'hms.tbhsd.gov.bd' ? API_DOMAIN : API_LOCAL;

// Pick image gateway dynamically
export const IMAGE_GATEWAY_URL = host === 'hms.tbhsd.gov.bd' ? IMAGE_DOMAIN : IMAGE_LOCAL;
