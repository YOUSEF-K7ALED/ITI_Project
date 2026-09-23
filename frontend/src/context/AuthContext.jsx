// Global auth state (Person 1, used by everyone)
// - Stores current user + JWT token (in state + localStorage)
// - Exposes: login(user, token), logout(), isAuthenticated, isAdmin
// - Wrap the whole app with <AuthProvider> in the root component
