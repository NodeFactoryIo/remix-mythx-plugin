import { call, put, spawn, takeEvery } from 'redux-saga/effects'
import { analysisConstants } from '../_constants'
import { mythxService } from '../_services'

const delay = (ms) => {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

function * checkAnalysisStatuses (action) {
  for (const request of action.payload) {
    yield spawn(checkAnalysisStatus, request)
  }
}

function * checkAnalysisStatus (request) {
  yield put({
    type: analysisConstants.ANALYSIS_STATUS_REQUEST,
    uuid: request.uuid
  })

  try {
    const response = yield call(mythxService.getAnalysationStatus, request.uuid)
    if (response.status === 'Finished') {
      yield put({
        type: analysisConstants.ANALYSIS_STATUS_SUCCESS,
        uuid: request.uuid
      })
      return yield call(getAnalysisReport, request.uuid)
    }
    if (response.status === 'Error') {
      return yield put({
        type: analysisConstants.ANALYSIS_REPORT_FAILURE,
        error: response.error,
        uuid: request.uuid
      })
    }
    yield call(delay, 2000)
    return yield call(checkAnalysisStatus, request)
  } catch (e) {
    yield put({type: analysisConstants.ANALYSIS_STATUS_FAILURE, error: e})
    yield call(delay, 2000)
    return yield call(checkAnalysisStatus, request)
  }
}

function * getAnalysisReport (uuid) {
  yield put({type: analysisConstants.ANALYSIS_REPORT_REQUEST})
  try {
    const response = yield call(mythxService.getAnalysationReport, uuid)
    yield put({
      type: analysisConstants.ANALYSIS_REPORT_SUCCESS,
      uuid,
      report: response
    })
  } catch (e) {
    yield put({
      type: analysisConstants.ANALYSIS_REPORT_FAILURE,
      uuid,
      error: e
    })
  }
}

export function * watchAnalysisSubmission () {
  yield takeEvery(analysisConstants.ANALYSIS_SUBMIT_SUCCESS, checkAnalysisStatuses)
}
