import { configureStore } from '@reduxjs/toolkit';
import recordsReducer from './records';

export const store = configureStore({
  reducer: {
    covid19: recordsReducer,
  },
});