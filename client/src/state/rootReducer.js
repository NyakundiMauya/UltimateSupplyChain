// src/state/rootReducer.js
import { combineReducers } from 'redux';
import globalReducer from './globalSlice'; 

const rootReducer = combineReducers({
    global: globalReducer, 
});

export default rootReducer;
