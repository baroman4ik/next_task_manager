import React from 'react';
import {Task} from '@/store/slices/tasksSlice';
import {formatDueDate} from '@/utils/helters';
import CurrentStatusString from "@/components/CurrentStatusString/CurrentStatusString";

interface TaskDetailsProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onSwitchToEdit?: (task: Task) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({task, onDelete, onStatusChange, onSwitchToEdit}) => {
  const handleLocalStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (task && task.id && onStatusChange) {
      onStatusChange(task.id, e.target.value as Task['status']);
    }
  };

  const handleEditClick = () => {
    if (task && onSwitchToEdit) {
      onSwitchToEdit(task);
    }
  };

  return (
    <>
      <div className="space-y-3 text-sm">
        <p><strong className="font-medium text-gray-900">Описание:</strong> <span
          className="text-black whitespace-pre-wrap break-words">{task.description || 'Нет описания'}</span></p>
        <p><strong className="font-medium text-gray-900">Срок выполнения:</strong> <span
          className="text-gray-500">{formatDueDate(task.dueDate)}</span>
          <CurrentStatusString task={task}/>
        </p>
        <div>
          <strong className="font-medium text-gray-900">Статус:</strong>
          <select
            value={task.status}
            disabled={(!onStatusChange) || (task.status === "failed" && !(task.dueDate && new Date(task.dueDate).getTime() > Date.now()))}
            onChange={handleLocalStatusChange}
            className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full text-white border-none outline-none appearance-none
              ${task.status === 'pending' ? 'bg-slate-400' :
              task.status === 'in-progress' ? 'bg-amber-500' :
                task.status === 'completed' ? 'bg-emerald-500' :
                  'bg-rose-500'}`}
          >
            <option value="pending" className="bg-white text-black">Ожидает</option>
            <option value="in-progress" className="bg-white text-black">В процессе</option>
            <option value="completed" className="bg-white text-black">Завершено</option>
            <option disabled value="failed" className="bg-white text-black">Провалено</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        {onDelete && (
          <button
            onClick={() => {
              if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
                onDelete(task.id);
              }
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-sm transition duration-150 w-full sm:w-auto"
          >
            Удалить задачу
          </button>
        )}
        <button
          onClick={handleEditClick}
          className="px-5 py-2.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition duration-150 w-full sm:w-auto"
        >
          Редактировать
        </button>
      </div>
    </>
  );
};

export default TaskDetails;