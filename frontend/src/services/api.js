// Shared axios/fetch instance
// - Base URL from environment variable (e.g. VITE_API_URL / REACT_APP_API_URL)
// - Request interceptor: attach JWT token from AuthContext/localStorage to headers
// - Response interceptor: handle 401 (logout + redirect to login)
