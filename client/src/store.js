// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './state/rootReducer'; // E
import { api } from './state/api'; //

const store = configureStore({
    reducer: {
        root: rootReducer, //
        [api.reducerPath]: api.reducer, // 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export default store;

