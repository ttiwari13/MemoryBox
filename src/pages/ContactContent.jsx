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
  Image
} from "lucide-react";

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-4 sm:p-6 my-4 sm:my-8 overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="sm:w-5 sm:h-5" />
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
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setCurrentPhoto(prev => ({ ...prev, imageUrl: reader.result, file }));
      };
      reader.readAsDataURL(file);
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
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-primary text-white px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-secondary transition-colors flex items-center space-x-2"
            >
              <Image size={16} className="sm:w-4 sm:h-4" />
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
            <div className="mt-3 sm:mt-4 w-full h-auto overflow-hidden rounded-lg border border-gray-300">
              <img src={imagePreview} alt="Image Preview" className="w-full h-auto object-contain" />
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
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
            placeholder="e.g., apple"
            required
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto bg-primary hover:bg-secondary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium text-sm sm:text-base"
        >
          <Save size={16} className="sm:w-4 sm:h-4" />
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
    if (feedback === "correct") return <Check className="text-green-700" size={20} />;
    if (feedback === "incorrect") return <X className="text-red-700" size={20} />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64">
        <img
          src={photo.imageUrl}
          alt={photo.correctAnswer}
          className="w-full h-full object-contain"
        />
        
        {/* Action Buttons */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex space-x-1.5 sm:space-x-2">
          <button 
            onClick={() => onEdit(photo)} 
            className="p-1.5 sm:p-2 bg-white text-primary rounded-full hover:bg-primary/10 transition-colors shadow-md"
          >
            <Edit3 size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={() => onDelete(photo.id)} 
            className="p-1.5 sm:p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-md"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Show answer only after feedback */}
        {feedback && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-white/90 px-2 sm:px-3 py-1 rounded-full">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Answer: {photo.correctAnswer}</span>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Question prompt */}
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">What do you see in this image?</h3>
          <p className="text-xs sm:text-sm text-gray-600">Click the microphone and speak your answer</p>
        </div>

        {speechSupported && (
          <button
            onClick={onMicClick}
            disabled={feedback}
            className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg font-medium text-sm sm:text-lg transition-all duration-200 ${
              feedback 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-primary hover:bg-secondary text-white"
            }`}
          >
            {isRecording ? (
              <>
                <Square size={18} className="sm:w-6 sm:h-6" />
                <span>Stop Recording</span>
              </>
            ) : feedback ? (
              <>
                <Check size={18} className="sm:w-6 sm:h-6" />
                <span>Answered</span>
              </>
            ) : (
              <>
                <Mic size={18} className="sm:w-6 sm:h-6" />
                <span>Start Speaking</span>
              </>
            )}
          </button>
        )}
        
        {!speechSupported && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-lg">
            <p className="text-yellow-700 text-center font-medium text-xs sm:text-sm">
              Microphone not supported in this browser
            </p>
          </div>
        )}
        
        {feedback && (
          <div className={`flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg font-bold text-base sm:text-xl transition-all ${getFeedbackColorClass()}`}>
            {getFeedbackIcon()}
            <span>{feedback === "correct" ? "Correct!" : "Try Again!"}</span>
          </div>
        )}

        {networkError && (
          <div className="bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <X size={16} className="sm:w-4 sm:h-4" />
              <span className="font-medium text-xs sm:text-sm">Network error. Please try again.</span>
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

    // Set feedback only for this specific photo
    setFeedback(prev => ({
      ...prev,
      [index]: isCorrect ? "correct" : "incorrect",
    }));

    // Clear feedback after 4 seconds for this specific photo
    setTimeout(() => {
      setFeedback(prev => {
        const newFeedback = { ...prev };
        delete newFeedback[index];
        return newFeedback;
      });
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
    <div className="p-3 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col justify-between items-center mb-6 sm:mb-8">
        <div className="text-center mb-4 w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Photo Memory Game
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
            Upload photos and let patients speak their answers using voice recognition.
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingPhoto(null);
            setIsFormModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors shadow-md text-sm sm:text-base"
        >
          <Plus size={16} className="sm:w-4 sm:h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Image size={24} className="sm:w-9 sm:h-9 text-gray-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-3 sm:mb-4">No Photos Yet</h3>
          <p className="text-gray-500 text-sm sm:text-lg mb-4 sm:mb-6 px-4">
            Add your first photo to start memory training exercises.
          </p>
          <button
            onClick={() => {
              setEditingPhoto(null);
              setIsFormModalOpen(true);
            }}
            className="bg-primary hover:bg-secondary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            Add Your First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
