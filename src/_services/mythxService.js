import config from '../config/config';

export const mythxService = {
  login,
  logout
};

function login(address, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ethAddress: address, password })
  };

  const user = {
    address
  };

  return fetch(`${config.MythX.apiUrl}/auth/login`, requestOptions)
    .then(handleResponse)
    .then(auth => {
      user.auth = auth;
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
