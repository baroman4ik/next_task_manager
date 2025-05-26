'use client';

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useRouter} from 'next/navigation';
import {AppDispatch, RootState} from '@/store';
import {addTask, deleteTask, editTask, Task, updateTaskStatus} from '@/store/slices/tasksSlice';
import {TaskList, updateTaskCount} from '@/store/slices/taskListsSlice';
import Link from 'next/link';
import {TaskModal} from "@/components/TaskModal/TaskModal";
import CurrentStatusString from "@/components/CurrentStatusString/CurrentStatusString";

const formatDueDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function TaskListPageDetails() {
  const params = useParams();
  const listId = params.listId as string;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {isAuthenticated} = useSelector((state: RootState) => state.auth);
  const taskList = useSelector((state: RootState) =>
    state.taskLists.lists.find((list: TaskList) => list.id === listId)
  );
  const tasks = useSelector((state: RootState) =>
    state.tasks.tasks.filter((task: Task) => task.listId === listId)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('edit');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (taskList) {
      const currentTaskCount = tasks.length;
      if (taskList.taskCount !== currentTaskCount) {
        dispatch(updateTaskCount({listId, count: currentTaskCount}));
      }
    }
  }, [tasks, taskList, listId, dispatch]);

  useEffect(() => {
    const updateOverdueTasks = () => {
      const now = new Date();
      const nowAtStartOfMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());

      tasks.forEach((task: Task) => {
        if (task.dueDate && task.status !== 'completed' && task.status !== 'failed') {
          const dueDate = new Date(task.dueDate);
          const dueDateAtStartOfMinute = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate(), dueDate.getHours(), dueDate.getMinutes());

          if (dueDateAtStartOfMinute.getTime() <= nowAtStartOfMinute.getTime()) {
            dispatch(updateTaskStatus({taskId: task.id, status: 'failed'}));
          }
        }
      });
    };

    const timerInterval = setInterval(updateOverdueTasks, 1000);
    updateOverdueTasks();

    return () => clearInterval(timerInterval);
  }, [tasks, dispatch]);

  const openModal = (mode: 'edit' | 'view', task: Task | null = null) => {
    setModalMode(mode);
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {

    if (selectedTask && modalMode === 'edit') {
      dispatch(editTask({...selectedTask, ...taskData} as Task));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        listId: listId!,
        name: taskData.name || '',
        description: taskData.description || '',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : new Date().toISOString(),
        status: taskData.status || 'pending',
        createdAt: new Date().toISOString(),
      };
      dispatch(addTask(newTask));
    }
    closeModal();
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      dispatch(deleteTask(taskId));
      if (isModalOpen && selectedTask?.id === taskId) {
        closeModal();
      }
    }
  };
  
  const handleStatusChange = (taskId: string, status: Task['status']) => {
    dispatch(updateTaskStatus({taskId, status}));
    if (isModalOpen && modalMode === 'view' && selectedTask?.id === taskId) {
      const updatedTask = tasks.find((t: Task) => t.id === taskId);
      if (updatedTask) {
        setSelectedTask({...updatedTask, status});
      }
    }
  };

  const handleSwitchToEditMode = (taskToEdit: Task) => {
    openModal('edit', taskToEdit);
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Перенаправление...</p></div>;
  }

  if (!taskList) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl text-red-600 mb-4">Список задач не найден</h1>
        <Link href="/task-lists">
          <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 px-4 rounded-md">
            Вернуться к спискам
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-200 p-4 sm:p-8">
      <header className="mb-8">
        <Link href="/task-lists">
          <button
            className="mb-6 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"/>
            </svg>
            Назад к спискам
          </button>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 truncate max-w-xl">{taskList.name}</h1>
          <button
            onClick={() => openModal('edit')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center mt-4 sm:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"/>
            </svg>
            Добавить задачу
          </button>
        </div>
      </header>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">В этом списке пока нет задач. Добавьте новую!</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: Task) => (
            <div key={task.id}
                 className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-800 truncate cursor-pointer hover:text-blue-600"
                    onClick={() => openModal('view', task)}>{task.name}</h3>
                <select
                  value={task.status}
                  disabled={task.status === "failed" && !(task.dueDate && new Date(task.dueDate).getTime() > Date.now())}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full text-white border-none outline-none appearance-none mt-2 sm:mt-0
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
              <p
                className="text-sm text-gray-600 mb-1 truncate whitespace-pre-wrap break-words">{task.description || 'Нет описания'}</p>
              <p className="text-xs text-gray-400 mb-1">Срок: {formatDueDate(task.dueDate)}
                <CurrentStatusString task={task}/>
              </p>

              <div
                className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-3">
                <button onClick={() => openModal('view', task)}
                        className="text-sky-600 hover:text-sky-800 transition duration-150 text-sm font-medium py-1 px-3 rounded-md bg-sky-100 hover:bg-sky-200 w-full sm:w-auto text-center">Детали
                </button>
                <button onClick={() => openModal('edit', task)}
                        className="text-amber-600 hover:text-amber-800 transition duration-150 text-sm font-medium py-1 px-3 rounded-md bg-amber-100 hover:bg-amber-200 w-full sm:w-auto text-center">Редактировать
                </button>
                <button onClick={() => handleDeleteTask(task.id)}
                        className="text-rose-600 hover:text-rose-800 transition duration-150 text-sm font-medium py-1 px-3 rounded-md bg-rose-100 hover:bg-rose-200 w-full sm:w-auto text-center">Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onCloseAction={closeModal}
        task={selectedTask}
        onSaveAction={handleSaveTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        mode={modalMode}
        listId={listId}
        onSwitchToEdit={handleSwitchToEditMode}
      />

    </div>
  );
}