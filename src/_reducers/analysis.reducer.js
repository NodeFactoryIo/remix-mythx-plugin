import { analysisConstants } from '../_constants'

const initialState = {}

export function analysis (state = initialState, action) {
  switch (action.type) {
    case analysisConstants.ANALYSIS_SUBMIT_REQUEST:
      return {
        ...state,
        isSubmitting: true
      }
    case analysisConstants.ANALYSIS_SUBMIT_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        requests: action.requests
      }
    case analysisConstants.ANALYSIS_SUBMIT_FAILURE:
      return {
        ...state,
        isSubmitting: false
      }
    case analysisConstants.ANALYSIS_STATUS_REQUEST: {
      const newState = state
      newState.polling = {
        ...newState.polling,
        [action.uuid]: true
      }
      return newState
    }
    case analysisConstants.ANALYSIS_STATUS_SUCCESS: {
      const newState = state
      newState.polling = {
        ...newState.polling,
        [action.uuid]: false
      }
      return newState
    }
    case analysisConstants.ANALYSIS_STATUS_FAILURE: {
      const newState = state
      newState.polling = {
        ...newState.polling,
        [action.uuid]: false
      }
      return newState
    }
    case analysisConstants.ANALYSIS_REPORT_REQUEST:
      return {
        ...state,
        isRequestingReport: true
      }
    case analysisConstants.ANALYSIS_REPORT_SUCCESS: {
      const newState = state
      newState.reports = {
        ...newState.reports,
        isRequestingReport: false,
        [action.uuid]: action.report
      }
      return newState
    }
    case analysisConstants.ANALYSIS_REPORT_FAILURE: {
      const newState = state
      newState.reports = {
        ...newState.reports,
        isRequestingReport: false,
        [action.uuid]: null
      }
      return newState
    }
    default:
      return state
  }
}
