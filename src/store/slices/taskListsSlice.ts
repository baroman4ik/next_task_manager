import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TaskList {
  id: string;
  name: string;
  taskCount: number;
}

interface TaskListsState {
  lists: TaskList[];
}

const initialState: TaskListsState = {
  lists: [],
};

const taskListsSlice = createSlice({
  name: 'taskLists',
  initialState,
  reducers: {
    addTaskList: (state, action: PayloadAction<TaskList>) => {
      state.lists.push(action.payload);
    },
    editTaskList: (state, action: PayloadAction<TaskList>) => {
      const index = state.lists.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    deleteTaskList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
    },
    updateTaskCount: (state, action: PayloadAction<{ listId: string; count: number }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.taskCount = action.payload.count;
      }
    }
  },
});

export const { addTaskList, editTaskList, deleteTaskList, updateTaskCount } = taskListsSlice.actions;
export default taskListsSlice.reducer;