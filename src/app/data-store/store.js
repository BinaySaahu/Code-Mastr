
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/app/data-store/slices/userSlice'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})