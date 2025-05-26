import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  listId: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: string;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: Task['status'] }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
      }
    },
    deleteTasksByListId: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.listId !== action.payload);
    }
  },
});

export const { addTask, editTask, deleteTask, updateTaskStatus, deleteTasksByListId } = tasksSlice.actions;
export default tasksSlice.reducer;