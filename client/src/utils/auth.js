import decode from 'jwt-decode';

class AuthService {
  // Retrieves the user's profile from the JWT
  getProfile() {
    return decode(this.getToken());
  }

  // Checks if the user is logged in by verifying the token
  loggedIn() {
    const token = this.getToken();
    // Uses the isTokenExpired method to check if the token is still valid
    return !!token && !this.isTokenExpired(token);
  }

  // Checks if the token has expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      // Checks if the expiration date of the token is in the past
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      // If the token cannot be decoded, it is considered expired
      return true;
    }
  }

  // Retrieves the user token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Saves user token to localStorage and redirects to the home page
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Clears user token from localStorage and reloads the app to reset state
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
