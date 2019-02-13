import {watchAnalysisSubmission} from './checkAnalysisStatus.saga'
import { all} from 'redux-saga/effects'

export default function* rootSaga() {
  yield all([
    watchAnalysisSubmission()
  ]);
}
