
import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { analysis } from './analysis.reducer';

const rootReducer = combineReducers({
  authentication,
  analysis
});

export default rootReducer;
