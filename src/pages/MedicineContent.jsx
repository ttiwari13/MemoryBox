import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Save,
  Pill,
  Coffee,
  Utensils,
  Footprints,
  Heart,
  Bed,
  Droplets,
  Book,
  Music,
  Download
} from 'lucide-react';

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Helper component for each content section
const ContentSection = ({ title, children, onAdd, onClearFilters }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
    <div className="flex justify-between items-center mb-4 border-b pb-4">
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <div className="flex items-center space-x-2">
        {onClearFilters && (
          <button 
            onClick={onClearFilters}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
        {onAdd && (
          <button 
            onClick={onAdd}
            className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            title={`Add new ${title.toLowerCase()}`}
          >
            <Plus size={20} />
          </button>
        )}
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>
    </div>
    {children}
  </div>
);

// Form Modal for Tasks
const TaskFormModal = ({ isOpen, onClose, onSave, task, setTask }) => {
  const taskTypes = {
    medication: { name: 'Medication' },
    meal: { name: 'Meals' },
    drink: { name: 'Drinks' },
    exercise: { name: 'Exercise' },
    checkup: { name: 'Health Check' },
    sleep: { name: 'Sleep' },
    hygiene: { name: 'Hygiene' },
    activity: { name: 'Activities' },
    therapy: { name: 'Therapy' }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.id ? 'Edit Task' : 'Add New Task'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
          <select
            name="type"
            value={task.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.entries(taskTypes).map(([type, config]) => (
              <option key={type} value={type}>{config.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter task title..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={task.time}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={task.notes}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-3 mt-6">
        <button
          onClick={onSave}
          disabled={!task.title || !task.time}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
        >
          <Save size={16} />
          <span>{task.id ? 'Update Task' : 'Add Task'}</span>
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

// Form Modal for Medication Inventory
const InventoryFormModal = ({ isOpen, onClose, onSave, item, setItem }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.id ? 'Edit Inventory Item' : 'Add New Inventory Item'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Ibuprofen"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pill Count</label>
          <input
            type="number"
            name="pills"
            value={item.pills}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={item.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="OK">OK</option>
            <option value="Refill Soon">Refill Soon</option>
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-3 mt-6">
        <button
          onClick={onSave}
          disabled={!item.name || item.pills === ''}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
        >
          <Save size={16} />
          <span>{item.id ? 'Update Item' : 'Add Item'}</span>
        </button>
        <button onClick={onClose} className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

// Component for the "Upcoming Doses" section
const UpcomingDoses = ({ tasks, onAdd, onEdit, onDelete, onMarkAsTaken }) => {
  const taskTypes = {
    medication: { icon: Pill, color: 'bg-red-100 text-red-600' },
    meal: { icon: Utensils, color: 'bg-green-100 text-green-600' },
    drink: { icon: Coffee, color: 'bg-blue-100 text-blue-600' },
    exercise: { icon: Footprints, color: 'bg-purple-100 text-purple-600' },
    checkup: { icon: Heart, color: 'bg-pink-100 text-pink-600' },
    sleep: { icon: Bed, color: 'bg-indigo-100 text-indigo-600' },
    hygiene: { icon: Droplets, color: 'bg-cyan-100 text-cyan-600' },
    activity: { icon: Book, color: 'bg-yellow-100 text-yellow-600' },
    therapy: { icon: Music, color: 'bg-orange-100 text-orange-600' }
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    missed: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <ContentSection title="Upcoming Tasks" onAdd={onAdd}>
      <div className="space-y-4">
        {tasks.map((task) => {
          const taskConfig = taskTypes[task.type];
          const Icon = taskConfig?.icon || Pill;
          return (
            <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 transition-colors duration-200 hover:bg-gray-100">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className={`p-2 rounded-full ${taskConfig?.color || 'bg-gray-100'}`}>
                  <Icon size={20} className={taskConfig?.color.split(' ')[1]} />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-700">{task.title}</span>
                  <span className="text-sm text-gray-500">{task.time} - {taskConfig?.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit task"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 size={16} />
                </button>
                {task.status === 'pending' ? (
                  <button 
                    onClick={() => onMarkAsTaken(task.id)}
                    className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    Mark as Taken
                  </button>
                ) : (
                  <div className={`flex items-center space-x-1 font-semibold text-sm px-4 py-2 rounded-full ${statusColors[task.status]}`}>
                    {task.status === 'completed' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>{task.status === 'completed' ? 'Completed' : 'Missed'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ContentSection>
  );
};

// Component for the "Medication Inventory" section
const MedicationInventory = ({ inventory, onAdd, onEdit, onDelete }) => {
  return (
    <ContentSection title="Medication Inventory" onAdd={onAdd}>
      <div className="space-y-4">
        {inventory.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">{item.name}</span>
              <span className="text-sm text-gray-600">{item.pills} pills</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${item.status === 'OK' ? 'text-green-500' : 'text-red-500'}`}>
                {item.status}
              </span>
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit item"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ContentSection>
  );
};

// Component for the "Medication Calendar" section
const MedicationCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dates, setDates] = useState([
    { day: 1, status: '' }, { day: 2, status: '' }, { day: 3, status: '' }, { day: 4, status: '' }, { day: 5, status: '' },
    { day: 6, status: '' }, { day: 7, status: '' }, { day: 8, status: '' }, { day: 9, status: '' }, { day: 10, status: '' },
    { day: 11, status: 'missed' }, { day: 12, status: 'taken' }, { day: 13, status: 'taken' }, { day: 14, status: 'taken' },
    { day: 15, status: 'taken' }, { day: 16, status: 'missed' }, { day: 17, status: 'taken' }, { day: 18, status: 'taken' },
    { day: 19, status: 'missed' }, { day: 20, status: 'missed' }, { day: 21, status: 'taken' }, { day: 22, status: 'taken' },
    { day: 23, status: 'taken' }, { day: 24, status: 'taken' }, { day: 25, status: 'missed' }, { day: 26, status: 'taken' },
    { day: 27, status: 'missed' }, { day: 28, status: 'taken' }, { day: 29, status: 'taken' }, { day: 30, status: 'taken' },
    { day: 31, status: 'taken' },
  ]);

  const [draggedStatus, setDraggedStatus] = useState(null);

  const formattedMonth = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleDrop = (day) => {
    if (draggedStatus) {
      setDates(prevDates => 
        prevDates.map(date => 
          date.day === day ? { ...date, status: draggedStatus } : date
        )
      );
      setDraggedStatus(null);
    }
  };

  const handleDragStart = (status) => {
    setDraggedStatus(status);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <ContentSection title="Medication Calendar">
      <div className="flex flex-col items-center mb-4">
        <div className="flex justify-center space-x-4 mb-4">
          <div 
            draggable 
            onDragStart={() => handleDragStart('taken')}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
              <Check size={16} className="text-green-800" />
            </div>
            <span className="text-sm mt-1 text-gray-600">Taken</span>
          </div>
          <div 
            draggable 
            onDragStart={() => handleDragStart('missed')}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
              <X size={16} className="text-red-800" />
            </div>
            <span className="text-sm mt-1 text-gray-600">Missed</span>
          </div>
        </div>

        <div className="flex justify-between items-center w-full text-lg font-semibold text-gray-700">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span>{formattedMonth}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
        {['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map(day => (
          <span key={day} className="text-gray-400">{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2 text-center text-sm">
        {dates.map((date, index) => (
          <span 
            key={index} 
            onDrop={() => handleDrop(date.day)}
            onDragOver={handleDragOver}
            className={`p-2 rounded-full cursor-pointer transition-colors duration-200
              ${date.status === 'taken' ? 'bg-green-200 text-green-800' : ''}
              ${date.status === 'missed' ? 'bg-red-200 text-red-800' : ''}
              ${date.status === '' ? 'text-gray-600 hover:bg-gray-100' : ''}
              ${draggedStatus && date.status === '' ? 'border-2 border-dashed border-indigo-400' : ''}`}
          >
            {date.day}
          </span>
        ))}
      </div>
    </ContentSection>
  );
};

// Component for Daily Adherence
const DailyAdherence = ({ adherence, onUpdateAdherence }) => {
  const circumference = 2 * Math.PI * 50; 
  const progressOffset = circumference - (adherence / 100) * circumference;

  const getAdherenceColorClass = (adherenceRate) => {
    if (adherenceRate >= 80) return 'text-green-500';
    if (adherenceRate >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const progressColorClass = getAdherenceColorClass(adherence);

  return (
    <ContentSection title="Daily Adherence">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle 
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="50"
              cx="80"
              cy="80"
            />
            <circle
              className={`${progressColorClass} transition-all duration-500 ease-out`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="50"
              cx="80"
              cy="80"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-gray-800">
            {adherence}%
          </div>
        </div>
        <div className="w-full mt-8">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`${progressColorClass.replace('text', 'bg')} h-3 rounded-full transition-all duration-500 ease-out`} 
              style={{ width: `${adherence}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm font-semibold mt-2">
            <span className="text-gray-600">Missed</span>
            <span className="text-green-500">Adhered</span>
          </div>
        </div>
        <button
          onClick={onUpdateAdherence}
          className="mt-6 px-6 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
        >
          Update Adherence
        </button>
      </div>
    </ContentSection>
  );
};

// Component for the "Notes & Side Effects" section
const NotesAndSideEffects = () => {
  const [notes, setNotes] = useState('');
  return (
    <ContentSection title="Notes & Side Effects">
      <div className="bg-gray-100 rounded-lg p-4 transition-colors duration-200 hover:bg-gray-200">
        <textarea
          className="w-full h-24 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
          placeholder="Add personal notes or side effects here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </ContentSection>
  );
};

// Main component that orchestrates all the sections and manages state
const MedicineContent = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Amoxicillin 500mg', type: 'medication', time: '08:00', status: 'pending', notes: '' },
    { id: 2, title: 'Breakfast', type: 'meal', time: '09:00', status: 'completed', notes: 'Ate well' },
    { id: 3, title: 'Morning Walk', type: 'exercise', time: '10:00', status: 'missed', notes: 'Weather permitting' },
  ]);
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Amoxicillin', pills: 15, status: 'OK' },
    { id: 2, name: 'Lisinopril', pills: 20, status: 'OK' },
    { id: 3, name: 'Setoomg', pills: 5, status: 'Refill Soon' },
  ]);
  const [adherence, setAdherence] = useState(80);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ id: null, title: '', type: 'medication', time: '', notes: '' });
  
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [currentInventoryItem, setCurrentInventoryItem] = useState({ id: null, name: '', pills: '', status: 'OK' });

  // Task Handlers
  const handleAddTaskClick = () => {
    setCurrentTask({ id: null, title: '', type: 'medication', time: '', notes: '' });
    setIsTaskModalOpen(true);
  };
  const handleEditTask = (task) => {
    setCurrentTask({ ...task });
    setIsTaskModalOpen(true);
  };
  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  const handleSaveTask = () => {
    if (currentTask.id) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === currentTask.id ? { ...currentTask } : task
      ));
    } else {
      const newTask = { ...currentTask, id: Date.now(), status: 'pending' };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setIsTaskModalOpen(false);
  };
  const handleMarkAsTaken = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
  };
  
  // Inventory Handlers
  const handleAddInventoryClick = () => {
    setCurrentInventoryItem({ id: null, name: '', pills: '', status: 'OK' });
    setIsInventoryModalOpen(true);
  };
  const handleEditInventory = (item) => {
    setCurrentInventoryItem({ ...item });
    setIsInventoryModalOpen(true);
  };
  const handleDeleteInventory = (itemId) => {
    setInventory(prevInventory => prevInventory.filter(item => item.id !== itemId));
  };
  const handleSaveInventory = () => {
    if (currentInventoryItem.id) {
      setInventory(prevInventory => prevInventory.map(item => 
        item.id === currentInventoryItem.id ? { ...currentInventoryItem } : item
      ));
    } else {
      const newItem = { ...currentInventoryItem, id: Date.now() };
      setInventory(prevInventory => [...prevInventory, newItem]);
    }
    setIsInventoryModalOpen(false);
  };
  
  // Adherence Handler
  const handleUpdateAdherence = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const newAdherence = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setAdherence(newAdherence);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto min-h-screen bg-gray-100">
      {/* Left Column */}
      <div className="grid grid-cols-1 gap-6">
        <UpcomingDoses 
          tasks={tasks}
          onAdd={handleAddTaskClick}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onMarkAsTaken={handleMarkAsTaken}
        />
        <MedicationCalendar />
      </div>

      {/* Right Column */}
      <div className="grid grid-cols-1 gap-6">
        <MedicationInventory
          inventory={inventory}
          onAdd={handleAddInventoryClick}
          onEdit={handleEditInventory}
          onDelete={handleDeleteInventory}
        />
        <DailyAdherence adherence={adherence} onUpdateAdherence={handleUpdateAdherence} />
        <NotesAndSideEffects />
      </div>

      <TaskFormModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
        setTask={setCurrentTask}
      />

      <InventoryFormModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSave={handleSaveInventory}
        item={currentInventoryItem}
        setItem={setCurrentInventoryItem}
      />
    </div>
  );
};

export default MedicineContent;