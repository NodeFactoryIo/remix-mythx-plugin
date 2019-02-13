import { analysisConstants } from '../_constants'

const initialState = {reports: {}, isSubmitting: false, isRequestingReport: false, polling: {}}

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
      state.polling = {
        ...state.polling,
        [action.uuid]: false
      }
      return {
        ...state
      }
    }
    case analysisConstants.ANALYSIS_STATUS_FAILURE: {
      state.polling = {
        ...state.polling,
        [action.uuid]: false
      }
      return {
        ...state
      }
    }
    case analysisConstants.ANALYSIS_REPORT_REQUEST:
      return {
        ...state,
        isRequestingReport: true
      }
    case analysisConstants.ANALYSIS_REPORT_SUCCESS: {
      state.reports = {
        ...state.reports,
        [action.uuid]: action.report
      }
      return {
        ...state,
        isRequestingReport: false
      }
    }
    case analysisConstants.ANALYSIS_REPORT_FAILURE: {
      state.reports = {
        ...state.reports,
        [action.uuid]: null
      }
      return {
        ...state,
        isRequestingReport: false
      }
    }
    default:
      return state
  }
}
