import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Check,
  X,
  Square,
  Plus,
  Edit3,
  Trash2,
  Save,
  Image as ImageIcon
} from "lucide-react";

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 my-8 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
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

// Component for the Photo Management Form
const PhotoForm = ({ photo, onSave, onCancel }) => {
  const [currentPhoto, setCurrentPhoto] = useState(photo);
  const [imagePreview, setImagePreview] = useState(photo.imageUrl || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImagePreview(newImageUrl);
      setCurrentPhoto(prev => ({ ...prev, imageUrl: newImageUrl, file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPhoto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPhoto.imageUrl || !currentPhoto.correctAnswer) {
      alert("Please provide both an image and a correct answer.");
      return;
    }
    onSave(currentPhoto);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center space-x-2"
            >
              <ImageIcon size={18} />
              <span>Choose File</span>
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          {imagePreview && (
            <div className="mt-4 w-full h-40 overflow-hidden rounded-lg border border-gray-300">
              <img src={imagePreview} alt="Image Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
          <input
            type="text"
            name="correctAnswer"
            value={currentPhoto.correctAnswer}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="e.g., apple"
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium"
        >
          <Save size={18} />
          <span>{currentPhoto.id ? "Save Changes" : "Add Photo"}</span>
        </button>
      </div>
    </form>
  );
};

// Simple Photo Entry Component
const PhotoEntry = ({
  photo,
  onMicClick,
  isRecording,
  feedback,
  speechSupported,
  networkError,
  onEdit,
  onDelete
}) => {
  const getFeedbackColorClass = () => {
    if (feedback === "correct") return "bg-green-100 text-green-700";
    if (feedback === "incorrect") return "bg-red-100 text-red-700";
    return "";
  };
  
  const getFeedbackIcon = () => {
    if (feedback === "correct") return <Check className="text-green-700" size={24} />;
    if (feedback === "incorrect") return <X className="text-red-700" size={24} />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-64">
        <img
          src={photo.imageUrl}
          alt={photo.correctAnswer}
          className="w-full h-full object-cover"
        />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button 
            onClick={() => onEdit(photo)} 
            className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors shadow-md"
          >
            <Edit3 size={18} />
          </button>
          <button 
            onClick={() => onDelete(photo.id)} 
            className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-md"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Correct Answer */}
        <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-gray-700">Answer: {photo.correctAnswer}</span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-6 space-y-4">
        {speechSupported && (
          <button
            onClick={onMicClick}
            className={`w-full flex items-center justify-center space-x-3 p-4 rounded-lg font-medium text-lg transition-all duration-200 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                : "bg-primary hover:bg-secondary text-white"
            }`}
          >
            {isRecording ? (
              <>
                <Square size={24} />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic size={24} />
                <span>Start Speaking</span>
              </>
            )}
          </button>
        )}
        
        {!speechSupported && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-yellow-700 text-center font-medium">
              Microphone not supported in this browser
            </p>
          </div>
        )}
        
        {feedback && (
          <div className={`flex items-center justify-center space-x-3 p-4 rounded-lg font-bold text-xl transition-all ${getFeedbackColorClass()}`}>
            {getFeedbackIcon()}
            <span>{feedback === "correct" ? "Correct!" : "Try Again!"}</span>
          </div>
        )}

        {networkError && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <X size={18} />
              <span className="font-medium text-sm">Network error. Please try again.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const ContactContent = () => {
  const [photos, setPhotos] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [recordingStates, setRecordingStates] = useState({});
  const [feedback, setFeedback] = useState({});
  const [speechSupported, setSpeechSupported] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
    }

    // Load saved photos from storage
    loadPhotosFromStorage();
  }, []);

  // Save photos to storage whenever photos array changes
  useEffect(() => {
    if (photos.length > 0) {
      savePhotosToStorage(photos);
    }
  }, [photos]);

  // Storage functions
  const savePhotosToStorage = (photosData) => {
    if (!window.memoryBoxStorage) {
      window.memoryBoxStorage = {};
    }
    window.memoryBoxStorage.contactPhotos = JSON.stringify(photosData);
  };

  const loadPhotosFromStorage = () => {
    try {
      if (window.memoryBoxStorage && window.memoryBoxStorage.contactPhotos) {
        const storedPhotos = JSON.parse(window.memoryBoxStorage.contactPhotos);
        setPhotos(storedPhotos);
      }
    } catch (error) {
      console.error('Error loading photos from storage:', error);
    }
  };

  const handleMicClick = async (index) => {
    if (!speechSupported) {
      alert("Microphone access is not supported in your browser.");
      return;
    }

    // If currently recording, stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      return;
    }

    // Start recording
    setRecordingStates(prev => ({ ...prev, [index]: true }));
    setNetworkError(false);
    setFeedback(prev => ({ ...prev, [index]: null }));
    await startSpeechRecognition(index);
  };
  
  const startSpeechRecognition = async (index) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setRecordingStates(prev => ({ ...prev, [index]: false }));
        
        if (audioChunksRef.current.length === 0) {
          setNetworkError(true);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          try {
            const response = await fetch('/api/transcribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                audioData: base64Audio,
                mimeType: 'audio/webm',
              }),
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.transcript && data.transcript.trim()) {
              validateAnswer(index, data.transcript);
            } else {
              setNetworkError(true);
            }
          } catch (error) {
            console.error("Transcription API error:", error);
            setNetworkError(true);
          }
        };
      };

      mediaRecorderRef.current.start();
      
    } catch (err) {
      console.error('Microphone access error:', err);
      setNetworkError(true);
      setRecordingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const validateAnswer = (index, userAnswer) => {
    const correctAnswer = photos[index].correctAnswer.toLowerCase().trim();
    const userInput = userAnswer.toLowerCase().trim();
    
    const words = correctAnswer.split(/\s+/);
    const isCorrect = words.some(word => userInput.includes(word)) || 
                     userInput.includes(correctAnswer) ||
                     correctAnswer.includes(userInput);

    setFeedback(prev => ({
      ...prev,
      [index]: isCorrect ? "correct" : "incorrect",
    }));

    setTimeout(() => {
      setFeedback(prev => ({
        ...prev,
        [index]: null,
      }));
    }, 4000);
  };

  const handleAddPhoto = (newPhoto) => {
    if (newPhoto.id) {
      setPhotos(photos.map(p => (p.id === newPhoto.id ? newPhoto : p)));
    } else {
      setPhotos([...photos, { ...newPhoto, id: Date.now() }]);
    }
    setIsFormModalOpen(false);
    setEditingPhoto(null);
  };

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setIsFormModalOpen(true);
  };

  const handleDeletePhoto = (id) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      setPhotos(photos.filter(p => p.id !== id));
      
      if (photos.length === 1) {
        if (window.memoryBoxStorage) {
          delete window.memoryBoxStorage.contactPhotos;
        }
      }
    }
  };

  return (
    <div className="p-8 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Photo Memory Game
          </h1>
          <p className="text-lg text-gray-600">
            Upload photos and let patients speak their answers using voice recognition.
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingPhoto(null);
            setIsFormModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors shadow-md"
        >
          <Plus size={18} />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon size={36} className="text-gray-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Photos Yet</h3>
          <p className="text-gray-500 text-lg mb-6">
            Add your first photo to start memory training exercises.
          </p>
          <button
            onClick={() => {
              setEditingPhoto(null);
              setIsFormModalOpen(true);
            }}
            className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Your First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <PhotoEntry
              key={photo.id}
              photo={photo}
              onMicClick={() => handleMicClick(index)}
              isRecording={recordingStates[index] || false}
              feedback={feedback[index]}
              speechSupported={speechSupported}
              networkError={networkError}
              onEdit={handleEditPhoto}
              onDelete={handleDeletePhoto}
            />
          ))}
        </div>
      )}

      {/* Photo Add/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPhoto(null);
        }}
        title={editingPhoto ? "Edit Photo Entry" : "Add New Photo"}
      >
        <PhotoForm
          photo={editingPhoto || { id: null, imageUrl: "", correctAnswer: "" }}
          onSave={handleAddPhoto}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingPhoto(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ContactContent;