export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.auth.access) {
    return { 'Authorization': 'Bearer ' + user.auth.access };
  } else {
    return {};
  }
}
