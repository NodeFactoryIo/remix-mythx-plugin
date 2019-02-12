import { userConstants } from '../_constants'
import { mythxService } from '../_services/index'

export const userActions = {
  login,
  logout
}

function login (address, password) {

  return dispatch => {
    dispatch(request({address}))

    mythxService.login(address, password)
      .then(
        user => {
          dispatch(success(user))
        },
        error => {
          dispatch(failure(error.toString()))
        }
      )

  }

  function request (user) {return {type: userConstants.LOGIN_REQUEST, user}}

  function success (user) {return {type: userConstants.LOGIN_SUCCESS, user}}

  function failure (error) {return {type: userConstants.LOGIN_FAILURE, error}}
}


function logout() {
  mythxService.logout();
  return { type: userConstants.LOGOUT };
}

