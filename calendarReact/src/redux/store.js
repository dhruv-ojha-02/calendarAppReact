import { configureStore } from '@reduxjs/toolkit'
import eventModalReducer from '../features/eventModal/eventModalSlice'
export const store = configureStore({
  reducer: {
    eventModal: eventModalReducer,
  }
})
