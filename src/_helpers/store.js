import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from '../_reducers'
import rootSaga from '../_sagas'
import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

const loggerMiddleware = createLogger()

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  rootReducer,
  applyMiddleware(
    loggerMiddleware,
    thunkMiddleware,
    sagaMiddleware,
  )
)

sagaMiddleware.run(rootSaga)
