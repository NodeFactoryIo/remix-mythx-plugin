import { analysisConstants } from '../_constants'
import { mythxService } from '../_services'

export const analysisActions = {
  analyzeContracts
}

function analyzeContracts (contracts, source) {

  return dispatch => {
    dispatch(request())

    mythxService.submitContractsForAnalysation(contracts, source)
      .then(requests => {
        return dispatch({
          type: analysisConstants.ANALYSIS_SUBMIT_SUCCESS,
          payload: requests
        });
      })
      .catch(error => {
        return dispatch(failure(error.toString()))
      })

    function request () {return {type: analysisConstants.ANALYSIS_SUBMIT_REQUEST}}

    function failure (error) {
      return {
        type: analysisConstants.ANALYSIS_SUBMIT_FAILURE,
        error
      }
    }
  }
}
