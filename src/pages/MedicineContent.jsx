import React, { useState, useEffect } from 'react';
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
  Music
} from 'lucide-react';

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
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
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
      <div className="flex items-center space-x-2">
        {onClearFilters && (
          <button 
            onClick={onClearFilters}
            className="text-primary hover:text-secondary transition-colors text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
        {onAdd && (
          <button 
            onClick={onAdd}
            className="p-2 text-primary hover:text-secondary transition-colors"
            title={`Add new ${title.toLowerCase()}`}
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </div>
    {children}
  </div>
);

// Form Modal for Medications
const TaskFormModal = ({ isOpen, onClose, onSave, task, setTask }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.id ? 'Edit Medication' : 'Add New Medication'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
            placeholder="Enter medication name..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={task.time}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={task.notes}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-gray-900"
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-3 mt-6">
        <button
          onClick={onSave}
          disabled={!task.title || !task.time}
          className="flex-1 bg-primary hover:bg-secondary disabled:bg-gray-300 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
        >
          <Save size={16} />
          <span>{task.id ? 'Update Medication' : 'Add Medication'}</span>
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
            placeholder="e.g., 30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={item.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
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
          className="flex-1 bg-primary hover:bg-secondary disabled:bg-gray-300 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
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

// Component for the "Upcoming Medications" section
const UpcomingMedications = ({ tasks, onAdd, onEdit, onDelete, onToggleStatus }) => {
  const statusColors = {
    taken: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    missed: 'bg-red-100 text-red-800 border-red-200'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'taken':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'missed':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <ContentSection title="Upcoming Medications" onAdd={onAdd}>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 transition-colors duration-200 hover:bg-gray-100">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <Pill size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-900">{task.title}</span>
                <span className="text-sm text-gray-700">{task.time}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-primary hover:text-secondary hover:bg-primary/10 rounded-lg transition-colors"
                title="Edit medication"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete medication"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => onToggleStatus(task.id)}
                className={`flex items-center space-x-1 font-semibold text-sm px-4 py-2 rounded-full transition-colors ${statusColors[task.status]}`}
              >
                {getStatusIcon(task.status)}
                <span>
                  {task.status === 'taken' ? 'Taken' : task.status === 'missed' ? 'Missed' : 'Mark as Taken'}
                </span>
              </button>
            </div>
          </div>
        ))}
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
              <span className="text-sm font-medium text-gray-900">{item.name}</span>
              <span className="text-sm text-gray-700">{item.pills} pills</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${item.status === 'OK' ? 'text-green-500' : 'text-red-500'}`}>
                {item.status}
              </span>
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-primary hover:text-secondary hover:bg-primary/10 rounded-lg transition-colors"
                title="Edit item"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  
  // Use a state for dates, initialized from local storage
  const [dates, setDates] = useState(() => {
    try {
      const storedDates = localStorage.getItem('medicationCalendar');
      if (storedDates) {
        return JSON.parse(storedDates);
      }
    } catch (error) {
      console.error('Error loading calendar from storage:', error);
    }
    // Default calendar if no data found
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, status: '' }));
  });
  
  // Save to local storage whenever dates change
  useEffect(() => {
    localStorage.setItem('medicationCalendar', JSON.stringify(dates));
  }, [dates]);

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
  
  // This effect will re-initialize the calendar when the month changes
  // It checks if new dates need to be created or if the old ones can be reused
  useEffect(() => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    if (dates.length !== daysInMonth) {
      setDates(Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, status: '' })));
    }
  }, [currentMonth, dates.length]);

  return (
    <ContentSection title="Medication Calendar">
      <div className="flex flex-col items-center mb-4">
        <div className="flex justify-center space-x-4 mb-4">
          <div 
            draggable 
            onDragStart={() => handleDragStart('taken')}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Check size={16} className="text-secondary" />
            </div>
            <span className="text-sm mt-1 text-gray-700">Taken</span>
          </div>
          <div 
            draggable 
            onDragStart={() => handleDragStart('missed')}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <X size={16} className="text-red-600" />
            </div>
            <span className="text-sm mt-1 text-gray-700">Missed</span>
          </div>
        </div>

        <div className="flex justify-between items-center w-full text-lg font-semibold text-gray-900">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span>{formattedMonth}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
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
              ${date.status === 'taken' ? 'bg-secondary/20 text-secondary' : ''}
              ${date.status === 'missed' ? 'bg-red-200 text-red-800' : ''}
              ${date.status === '' ? 'text-gray-900 hover:bg-gray-100' : ''}
              ${draggedStatus && date.status === '' ? 'border-2 border-dashed border-primary/40' : ''}`}
          >
            {date.day}
          </span>
        ))}
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
          className="w-full h-24 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
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
    { id: 2, title: 'Lisinopril 10mg', type: 'medication', time: '09:00', status: 'taken', notes: '' },
    { id: 3, title: 'Vitamin D', type: 'medication', time: '10:00', status: 'missed', notes: 'Forgot to buy' },
  ]);
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Amoxicillin', pills: 15, status: 'OK' },
    { id: 2, name: 'Lisinopril', pills: 20, status: 'OK' },
    { id: 3, name: 'Setoomg', pills: 5, status: 'Refill Soon' },
  ]);

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
  const handleToggleStatus = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        let newStatus;
        if (task.status === 'taken') {
          newStatus = 'missed';
        } else if (task.status === 'missed') {
          newStatus = 'pending';
        } else { // 'pending'
          newStatus = 'taken';
        }
        return { ...task, status: newStatus };
      }
      return task;
    }));
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto min-h-screen bg-gray-100">
      {/* Left Column */}
      <div className="grid grid-cols-1 gap-6">
        <UpcomingMedications 
          tasks={tasks.filter(t => t.type === 'medication')}
          onAdd={handleAddTaskClick}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
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
