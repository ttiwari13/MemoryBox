import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Coffee, 
  Utensils, 
  Footprints, 
  Heart, 
  Bed, 
  Droplets, 
  Book, 
  Music, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  User,
  X,
  Save,
  Edit3,
  Trash2
} from 'lucide-react';

const TaskContent = ({ patients = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    patientId: '',
    type: 'medication',
    title: '',
    time: '',
    notes: ''
  });
  
  const [tasks, setTasks] = useState([]);

  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPatientId, setFilterPatientId] = useState('all');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (patients.length > 0) {
      setNewTask(prev => ({ ...prev, patientId: patients[0].id }));
      setFilterPatientId(patients[0].id);
    }
  }, [patients]);

  const taskTypes = {
    medication: { icon: Pill, color: 'bg-red-100 text-red-600', name: 'Medication' },
    meal: { icon: Utensils, color: 'bg-green-100 text-green-600', name: 'Meals' },
    drink: { icon: Coffee, color: 'bg-blue-100 text-blue-600', name: 'Drinks' },
    exercise: { icon: Footprints, color: 'bg-purple-100 text-purple-600', name: 'Exercise' },
    checkup: { icon: Heart, color: 'bg-pink-100 text-pink-600', name: 'Health Check' },
    sleep: { icon: Bed, color: 'bg-indigo-100 text-indigo-600', name: 'Sleep' },
    hygiene: { icon: Droplets, color: 'bg-cyan-100 text-cyan-600', name: 'Hygiene' },
    activity: { icon: Book, color: 'bg-yellow-100 text-yellow-600', name: 'Activities' },
    therapy: { icon: Music, color: 'bg-orange-100 text-orange-600', name: 'Therapy' }
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    missed: 'bg-red-100 text-red-800 border-red-200'
  };

  const getPatientName = (id) => {
    const patient = patients.find(p => p.id === id);
    return patient ? patient.name : 'Unknown Patient';
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const statusOrder = ['pending', 'completed', 'missed'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask({
      patientId: task.patientId,
      type: task.type,
      title: task.title,
      time: task.time,
      notes: task.notes
    });
    setShowAddModal(true);
  };

  const saveTask = () => {
    if (!newTask.title || !newTask.time || !newTask.patientId) return;

    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...newTask }
          : task
      ));
      setEditingTask(null);
    } else {
      // Add new task
      const task = {
        id: Date.now(),
        ...newTask,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      setTasks(prev => [...prev, task]);
    }

    // Reset form
    setNewTask({
      patientId: patients.length > 0 ? patients[0].id : '',
      type: 'medication',
      title: '',
      time: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    const typeMatch = filterType === 'all' || task.type === filterType;
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const patientMatch = filterPatientId === 'all' || task.patientId === filterPatientId;
    const dateMatch = task.date === selectedDate.toISOString().split('T')[0];
    return typeMatch && statusMatch && patientMatch && dateMatch;
  });

  const getTasksForToday = () => {
    return filteredTasks.sort((a, b) => a.time.localeCompare(b.time));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'missed':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const clearAllFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setFilterPatientId('all');
  };

  return (
    <div className="p-4 sm:p-6 overflow-y-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Task Management</h1>
        <p className="text-base sm:text-lg text-gray-600">Track daily activities and care tasks for your patients</p>
      </div>

      {/* Current Time & Date */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-indigo-100 p-2 sm:p-3 rounded-full">
              <Calendar className="text-indigo-600" size={20} sm:size={28} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <p className="text-sm sm:text-lg text-gray-600">
                Current time: {currentDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-medium">Add Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Task Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Task Filters</h3>
              {(filterType !== 'all' || filterStatus !== 'all' || filterPatientId !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Patient Filter */}
            {patients.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Patient</label>
                <select
                  value={filterPatientId}
                  onChange={(e) => setFilterPatientId(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Patients</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Task Type Filter */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(taskTypes).map(([type, config]) => {
                  const Icon = config.icon;
                  const count = tasks.filter(task => task.type === type && (filterPatientId === 'all' || task.patientId === filterPatientId)).length;
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(filterType === type ? 'all' : type)}
                      className={`p-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                        filterType === type 
                          ? 'bg-indigo-100 border-2 border-indigo-300 shadow-md' 
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className={`p-1 rounded-full ${config.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-gray-800">{config.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <div className="space-y-2">
                {[
                  { key: 'all', label: 'All Tasks', icon: null },
                  { key: 'pending', label: 'Pending', icon: Clock },
                  { key: 'completed', label: 'Completed', icon: CheckCircle },
                  { key: 'missed', label: 'Missed', icon: AlertCircle }
                ].map(status => {
                  const Icon = status.icon;
                  const count = status.key === 'all' 
                    ? tasks.filter(t => filterPatientId === 'all' || t.patientId === filterPatientId).length
                    : tasks.filter(t => t.status === status.key && (filterPatientId === 'all' || t.patientId === filterPatientId)).length;
                  return (
                    <button
                      key={status.key}
                      onClick={() => setFilterStatus(status.key)}
                      className={`w-full p-2 sm:p-3 rounded-lg text-left transition-all duration-200 flex items-center space-x-3 ${
                        filterStatus === status.key 
                          ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300' 
                          : 'hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      {Icon && <Icon size={16} />}
                      <div className="flex-1">
                        <span className="font-medium text-sm">{status.label}</span>
                        <span className="ml-2 text-xs text-gray-500">({count})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Today's Tasks</h3>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                  <Filter size={16} />
                  <span>
                    {filterType !== 'all' && `${taskTypes[filterType]?.name} • `}
                    {filterStatus !== 'all' && `${filterStatus} • `}
                    {filteredTasks.length} tasks
                  </span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {getTasksForToday().map(task => {
                const taskConfig = taskTypes[task.type];
                const Icon = taskConfig?.icon || Clock;
                
                return (
                  <div key={task.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
                        {/* Task Icon */}
                        <div className={`p-2 sm:p-3 rounded-full ${taskConfig?.color || 'bg-gray-100 text-gray-600'}`}>
                          <Icon size={18} sm:size={22} />
                        </div>

                        {/* Task Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-1 sm:mb-2">
                            <h4 className="font-semibold text-gray-800 text-base sm:text-lg">{task.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
                              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <User size={14} />
                              <span className="font-medium">{getPatientName(task.patientId)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={14} />
                              <span>{formatTime(task.time)}</span>
                            </div>
                            {task.notes && (
                              <span className="text-gray-500 italic">"{task.notes}"</span>
                            )}
                          </div>
                        </div>

                        {/* Status Icon (on mobile, it's part of the main block) */}
                        <div className="hidden sm:flex items-center space-x-2 ml-auto">
                          {getStatusIcon(task.status)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                        <button
                          onClick={() => editTask(task)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        >
                          Mark as {task.status === 'completed' ? 'Pending' : task.status === 'pending' ? 'Completed' : 'Pending'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTasks.length === 0 && (
              <div className="p-8 sm:p-12 text-center text-gray-500">
                <Calendar size={48} sm:size={64} className="mx-auto mb-2 sm:mb-4 text-gray-300" />
                <p className="text-sm sm:text-lg">No tasks found for the selected filters</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-2 sm:mt-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  Clear filters to view all tasks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            count: tasks.filter(t => t.status === 'completed' && (filterPatientId === 'all' || t.patientId === filterPatientId)).length,
            label: 'Completed Today',
            icon: CheckCircle,
            color: 'bg-green-100 text-green-600',
            textColor: 'text-green-600'
          },
          {
            count: tasks.filter(t => t.status === 'pending' && (filterPatientId === 'all' || t.patientId === filterPatientId)).length,
            label: 'Pending Tasks',
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-600',
            textColor: 'text-yellow-600'
          },
          {
            count: tasks.filter(t => t.status === 'missed' && (filterPatientId === 'all' || t.patientId === filterPatientId)).length,
            label: 'Missed Tasks',
            icon: AlertCircle,
            color: 'bg-red-100 text-red-600',
            textColor: 'text-red-600'
          },
          {
            count: tasks.filter(t => filterPatientId === 'all' || t.patientId === filterPatientId).length,
            label: 'Total Tasks',
            icon: Calendar,
            color: 'bg-blue-100 text-blue-600',
            textColor: 'text-blue-600'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                <stat.icon size={20} sm:size={24} />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                  {stat.count}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm sm:max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                  setNewTask({
                    patientId: patients.length > 0 ? patients[0].id : '',
                    type: 'medication',
                    title: '',
                    time: '',
                    notes: ''
                  });
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {patients.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <select
                    value={newTask.patientId}
                    onChange={(e) => setNewTask(prev => ({ 
                      ...prev, 
                      patientId: e.target.value
                    }))}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.entries(taskTypes).map(([type, config]) => (
                    <option key={type} value={type}>{config.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                  setNewTask({
                    patientId: patients.length > 0 ? patients[0].id : '',
                    type: 'medication',
                    title: '',
                    time: '',
                    notes: ''
                  });
                }}
                className="w-full sm:w-auto px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
                disabled={!newTask.title || !newTask.time || !newTask.patientId}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium text-sm"
              >
                <Save size={16} />
                <span>{editingTask ? 'Update Task' : 'Add Task'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskContent;