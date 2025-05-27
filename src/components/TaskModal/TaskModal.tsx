'use client';

import {FormEvent, useEffect, useState} from 'react';
import {Task} from '@/store/slices/tasksSlice';
import TaskForm from './TaskForm';
import TaskDetails from './TaskDetails';


interface TaskModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  task?: Task | null;
  onSaveAction: (taskData: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  mode?: 'edit' | 'view';
  listId?: string;
  onSwitchToEdit?: (task: Task) => void;
}

export function TaskModal({
                            isOpen,
                            onCloseAction,
                            task,
                            onSaveAction,
                            onDelete,
                            onStatusChange,
                            mode = 'edit',
                            listId,
                            onSwitchToEdit
                          }: TaskModalProps) {
  const [taskFormData, setTaskFormData] = useState<Partial<Task>>({});
  const [formError, setFormError] = useState('');
  const isEditing = mode === 'edit' && !!task;
  const isCreating = mode === 'edit' && !task;
  const isViewing = mode === 'view' && !!task;

  useEffect(() => {
    if (isOpen) {
      if (isEditing || isCreating) {
        setTaskFormData(
          task
            ? {
              ...task,
              dueDate: task.dueDate ? new Date(new Date(task.dueDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 16) : getDefaultDueDate()
            }
            : {name: '', description: '', dueDate: getDefaultDueDate(), status: 'pending', listId: listId}
        );
      }
      setFormError('');
    }
  }, [isOpen, task, mode, listId]);

  const getDefaultDueDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleTaskFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setTaskFormData(prev => ({...prev, [name]: value}));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!taskFormData.name?.trim()) {
      setFormError('Название задачи не может быть пустым.');
      return;
    }
    if (!taskFormData.dueDate) {
      setFormError('Необходимо указать дату и время выполнения задачи.');
      return;
    }
    const selectedDueDate = new Date(taskFormData.dueDate);

    let newStatus = taskFormData.status;

    if (task && task.status === 'failed') {
      if (selectedDueDate.getTime() > Date.now()) {
        if (taskFormData.status === 'failed') {
          newStatus = 'pending';
        }
      } else {
        newStatus = 'failed';
      }
    } else if (selectedDueDate.getTime() <= Date.now() && taskFormData.status !== 'failed' && taskFormData.status !== 'completed') {
      setFormError('Дата выполнения должна быть в будущем.');
      return;
    }

    const taskDataToSave: Partial<Task> = {
      ...taskFormData,
      dueDate: new Date(taskFormData.dueDate).toISOString(),
      status: newStatus,
    };
    if (isCreating && listId) {
      taskDataToSave.listId = listId;
    }

    onSaveAction(taskDataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg my-8">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 truncate pr-4">
            {isViewing && task ? task.name :
              isEditing ? 'Редактировать задачу' : 'Новая задача'}
          </h3>
          <button onClick={onCloseAction} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {isViewing && task &&
          <TaskDetails
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onSwitchToEdit={onSwitchToEdit}
          />
        }
        {(isCreating || isEditing) &&
          <TaskForm
            taskFormData={taskFormData}
            handleTaskFormChange={handleTaskFormChange}
            handleSave={handleSave}
            formError={formError}
            onCloseAction={onCloseAction}
            isEditing={isEditing}
          />
        }

      </div>
    </div>
  );
}