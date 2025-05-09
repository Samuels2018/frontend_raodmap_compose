import { useState } from 'react';

function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      description: newTask,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Separar tareas completadas y no completadas
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Task Tracker</h1>
      
      <div className="flex mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={addTask}
          className="px-4 py-2 bg-green-500 text-white font-medium rounded-r-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </div>
      
      <div className="space-y-2">
        {/* Tareas pendientes */}
        {pendingTasks.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Tasks</h2>
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 text-green-500 rounded focus:ring-green-400"
                />
                <span className="ml-3 flex-1 text-gray-800">{task.description}</span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tareas completadas */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Completed Tasks</h2>
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 text-green-500 rounded focus:ring-green-400"
                />
                <span className="ml-3 flex-1 text-gray-500 line-through">{task.description}</span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 p-1 text-red-400 hover:text-red-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay tareas */}
        {tasks.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No tasks yet. Add your first task above!
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskTracker;