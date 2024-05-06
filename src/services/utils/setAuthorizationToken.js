import axios from 'axios';

export default function setAuthorizationToken(token) {
  if (token) {
    window.localStorage.setItem('access_token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}
