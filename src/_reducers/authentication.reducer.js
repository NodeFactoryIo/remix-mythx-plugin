import { userConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : { loggedIn: false, loggingIn: false, user: {}};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loggedIn: false,
        user: {},
      };
    case userConstants.REFRESH_REQUEST:
      return {
        refreshing: true,
        user: action.user
      };
    case userConstants.REFRESH_SUCCESS:
      return {
        ...state,
        refreshing: false,
        loggedIn: true,
        user: action.user
      };
    case userConstants.REFRESH_FAILURE:
      return {
        ...state,
        refreshing: false,
        loggedIn: false,
        user: {},
      };
    case userConstants.LOGOUT:
      return {
        loggingIn: false,
        loggedIn: false,
        user: {},
      };
    default:
      return state
  }
}
