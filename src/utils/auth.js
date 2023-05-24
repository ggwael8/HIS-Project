export function checkAuth() {
  if (localStorage.getItem('token')) {
    return true;
  } else {
    return false;
  }
}

export function getAuthToken() {
  return localStorage.getItem('token');
}

export const auth = 'Bearer ' + getAuthToken();