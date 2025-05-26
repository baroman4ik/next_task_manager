'use client';

import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/navigation';
import {AppDispatch, RootState} from '@/store';
import {addTaskList, deleteTaskList, editTaskList, updateTaskCount} from '@/store/slices/taskListsSlice';
import {deleteTasksByListId} from '@/store/slices/tasksSlice';
import Link from 'next/link';

interface TaskList {
  id: string;
  name: string;
  taskCount: number;
}

export default function TaskListsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);
  const taskLists = useSelector((state: RootState) => state.taskLists.lists);
  const allTasks = useSelector((state: RootState) => state.tasks.tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [listNameError, setListNameError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    taskLists.forEach(list => {
      const count = allTasks.filter(task => task.listId === list.id).length;
      if (list.taskCount !== count) {
        dispatch(updateTaskCount({listId: list.id, count}));
      }
    });
  }, [allTasks, taskLists, dispatch]);

  const openModal = (list: TaskList | null = null) => {
    setEditingList(list);
    setNewListName(list ? list.name : '');
    setListNameError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingList(null);
    setNewListName('');
    setListNameError('');
  };

  const handleSaveList = () => {
    if (!newListName.trim()) {
      setListNameError('Название списка не может быть пустым.');
      return;
    }
    if (editingList) {
      dispatch(editTaskList({...editingList, name: newListName}));
    } else {
      const newList: TaskList = {
        id: Date.now().toString(),
        name: newListName,
        taskCount: 0,
      };
      dispatch(addTaskList(newList));
    }
    closeModal();
  };

  const handleDeleteList = (listId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот список задач и все его задачи?')) {
      dispatch(deleteTaskList(listId));
      dispatch(deleteTasksByListId(listId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Перенаправление на страницу входа...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Мои списки задач</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"/>
          </svg>
          Добавить список
        </button>
      </header>

      {taskLists.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">У вас пока нет списков задач. Создайте новый!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskLists.map((list) => (
            <div key={list.id}
                 className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{list.name}</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Всего: {list.taskCount} {list.taskCount === 1 ? 'задача' : list.taskCount >= 2 && list.taskCount <= 4 ? 'задачи' : 'задач'}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1 text-xs">
                    {Object.entries(allTasks.filter(task => task.listId === list.id).reduce((acc, task) => {
                      acc[task.status] = (acc[task.status] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).map(([status, count]) => (
                      <span key={status}
                            className={`px-2 py-0.5 rounded-full text-white ${status === 'pending' ? 'bg-gray-400' : status === 'in-progress' ? 'bg-yellow-500' : status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {status}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                <Link href={`/task-lists/${list.id}`} className="w-full sm:w-auto">
                  <button
                    className="w-full text-center bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md text-sm transition duration-150">
                    Открыть
                  </button>
                </Link>
                <div className="flex w-full sm:w-auto space-x-2">
                  <button
                    onClick={() => openModal(list)}
                    className="w-1/2 sm:w-auto flex-grow bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md text-sm transition duration-150"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="w-1/2 sm:w-auto flex-grow bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-md text-sm transition duration-150"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              {editingList ? 'Редактировать список' : 'Новый список задач'}
            </h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => {
                setNewListName(e.target.value);
                if (e.target.value.trim()) setListNameError('');
              }}
              placeholder="Название списка"
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:border-blue-500 transition duration-150 ease-in-out ${listNameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {listNameError && <p className="text-red-500 text-xs mt-1">{listNameError}</p>}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition duration-150"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveList}
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition duration-150"
              >
                {editingList ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}