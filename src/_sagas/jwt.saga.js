import { call, put, takeEvery } from 'redux-saga/effects'
import { userConstants } from '../_constants'
import { mythxService } from '../_services'

const delay = (ms) => {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

function * refreshToken (action) {
  yield call(delay, 60 * 1000)
  yield put({type: userConstants.REFRESH_REQUEST})
  try {
    const user = yield call(mythxService.refreshToken, action.user.auth.access, action.user.auth.refresh)
    yield put({
      type: userConstants.REFRESH_SUCCESS,
      user
    })
  } catch (e) {
    yield put({
      type: userConstants.REFRESH_FAILURE,
      error: e.toString()
    })
  }
}

export function * watchAuthExpiry () {
  const user = JSON.parse(localStorage.getItem('user'))
  if(user && user.auth && user.auth.access) {
    yield call(refreshToken, {user})
  }
  yield takeEvery([userConstants.LOGIN_SUCCESS, userConstants.REFRESH_SUCCESS], refreshToken)
}
