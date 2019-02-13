import { watchAnalysisSubmission } from './checkAnalysisStatus.saga'
import { all } from 'redux-saga/effects'
import { watchAuthExpiry } from './jwt.saga'

export default function * rootSaga () {
  yield all([
    watchAnalysisSubmission(),
    watchAuthExpiry()
  ])
}
