import React from 'react';
import {Task} from '@/store/slices/tasksSlice';

interface TaskFormProps {
  taskFormData: Partial<Task>;
  handleTaskFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSave: (e: React.FormEvent) => void;
  formError: string;
  onCloseAction: () => void;
  isEditing: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
                                             taskFormData,
                                             handleTaskFormChange,
                                             handleSave,
                                             formError,
                                             onCloseAction,
                                             isEditing
                                           }) => {
  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">Название задачи</label>
        <input
          id="taskName"
          name="name"
          type="text"
          value={taskFormData.name || ''}
          onChange={handleTaskFormChange}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 transition duration-150 ease-in-out text-black ${formError && !taskFormData.name?.trim() ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
          placeholder="Например, подготовить отчет"
        />
      </div>
      <div>
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
        <textarea
          id="taskDescription"
          name="description"
          rows={4}
          value={taskFormData.description || ''}
          onChange={handleTaskFormChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-black"
          placeholder="Детали задачи..."
        />
      </div>
      <div>
        <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">Дата и время
          выполнения</label>
        <input
          id="taskDueDate"
          name="dueDate"
          type="datetime-local"
          value={taskFormData.dueDate || ''}
          onChange={handleTaskFormChange}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 transition duration-150 ease-in-out text-gray-500 ${formError && (!taskFormData.dueDate || (taskFormData.dueDate && new Date(taskFormData.dueDate).getTime() <= Date.now())) && !(taskFormData.status === 'failed' && (taskFormData.dueDate && new Date(taskFormData.dueDate).getTime() > Date.now())) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
        />
      </div>
      <div>
        <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
        <select
          disabled={taskFormData.status === "failed" && !(taskFormData.dueDate && new Date(taskFormData.dueDate).getTime() > Date.now())}
          id="taskStatus"
          name="status"
          value={taskFormData.status || 'pending'}
          onChange={handleTaskFormChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white text-gray-500"
        >
          <option value="pending">Ожидает</option>
          <option value="in-progress">В процессе</option>
          <option value="completed">Завершено</option>
          <option disabled value="failed">Провалено</option>
        </select>
      </div>
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCloseAction}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition duration-150"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition duration-150"
        >
          {isEditing ? 'Сохранить изменения' : 'Создать задачу'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;