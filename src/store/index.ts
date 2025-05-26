import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskListsReducer from './slices/taskListsSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    taskLists: taskListsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;