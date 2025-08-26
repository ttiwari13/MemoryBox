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
  ArrowLeft,
  User,
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

// Component for the Photo Management Form (Caregiver)
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
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium"
        >
          <Save size={18} />
          <span>{currentPhoto.id ? "Save Changes" : "Add Photo"}</span>
        </button>
      </div>
    </form>
  );
};

// Simple Photo Entry Component (Patient View)
const PhotoEntry = ({
  imageUrl,
  onMicClick,
  isRecording,
  feedback,
  speechSupported,
  networkError,
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
    <div className="flex flex-col items-center p-4 rounded-xl shadow-lg border-2 border-gray-200 bg-white">
      <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt="Memory Photo"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full space-y-4">
        {speechSupported && (
          <button
            onClick={onMicClick}
            className={`w-full flex items-center justify-center space-x-2 p-4 rounded-lg font-medium transition-all duration-200 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
            }`}
          >
            {isRecording ? (
              <>
                <Square size={20} />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic size={20} />
                <span>Speak Answer</span>
              </>
            )}
          </button>
        )}
        
        {feedback && (
          <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg font-bold text-lg transition-all ${getFeedbackColorClass()}`}>
            {getFeedbackIcon()}
            <span>{feedback === "correct" ? "Correct!" : "Incorrect"}</span>
          </div>
        )}

        {networkError && (
          <div className="text-center text-red-500 text-sm mt-2">
            Network error. Please check your connection and try again.
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const ContactContent = () => {
  const [photos, setPhotos] = useState([
    { id: 1, imageUrl: "https://via.placeholder.com/400x300/FF6B6B/ffffff?text=Apple", correctAnswer: "apple" },
    { id: 2, imageUrl: "https://via.placeholder.com/400x300/4ECDC4/ffffff?text=Banana", correctAnswer: "banana" },
    { id: 3, imageUrl: "https://via.placeholder.com/400x300/45B7D1/ffffff?text=Orange", correctAnswer: "orange" },
  ]);
  const [isCaregiverMode, setIsCaregiverMode] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [recordingStates, setRecordingStates] = useState({});
  const [feedback, setFeedback] = useState({});
  const [speechSupported, setSpeechSupported] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const handleMicClick = async (index) => {
    if (!speechSupported) {
      alert("Microphone access is not supported in your browser.");
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingStates(prev => ({ ...prev, [index]: false }));
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    } else {
      setRecordingStates(prev => ({ ...prev, [index]: true }));
      setNetworkError(false);
      await startGeminiSpeechRecognition(index);
    }
  };
  
  const startGeminiSpeechRecognition = async (index) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
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
            const data = await response.json();
            if (data.transcript) {
              validateAnswer(index, data.transcript);
            } else {
              setNetworkError(true);
            }
          } catch (error) {
            console.error("Transcription API error:", error);
            setNetworkError(true);
          } finally {
             setRecordingStates(prev => ({ ...prev, [index]: false }));
          }
        };
      };

      mediaRecorderRef.current.start();
      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 5000); // Stop recording after 5 seconds
      
    } catch (err) {
      console.error('Microphone access error:', err);
      setNetworkError(true);
      setRecordingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const validateAnswer = (index, userAnswer) => {
    const correctAnswer = photos[index].correctAnswer.toLowerCase();
    const userInput = userAnswer.toLowerCase().trim();
    const isCorrect = userInput.includes(correctAnswer) || correctAnswer.includes(userInput);

    setFeedback(prev => ({
      ...prev,
      [index]: isCorrect ? "correct" : "incorrect",
    }));

    setTimeout(() => {
      setFeedback(prev => ({
        ...prev,
        [index]: null,
      }));
    }, 3000);
  };

  // Caregiver Handlers
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
    setPhotos(photos.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧠 Photo Memory Game
          </h1>
          <p className="text-lg text-gray-600">
            {isCaregiverMode ? "Manage photo entries" : "Look at the photos and say what you see!"}
          </p>
        </div>
        
        {/* Mode Switcher */}
        <button
          onClick={() => setIsCaregiverMode(!isCaregiverMode)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md"
        >
          {isCaregiverMode ? (
            <>
              <ArrowLeft size={18} />
              <span>Go to Patient View</span>
            </>
          ) : (
            <>
              <User size={18} />
              <span>Caregiver Mode</span>
            </>
          )}
        </button>
      </div>

      {isCaregiverMode ? (
        // Caregiver Mode View
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Photo Library
            </h2>
            <button
              onClick={() => {
                setEditingPhoto(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
            >
              <Plus size={18} />
              <span>Add New Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map(photo => (
              <div key={photo.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="w-full h-40 mb-3 overflow-hidden rounded-lg">
                  <img src={photo.imageUrl} alt={photo.correctAnswer} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{photo.correctAnswer}</p>
                </div>
                <div className="flex justify-center space-x-3 mt-4">
                  <button onClick={() => handleEditPhoto(photo)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDeletePhoto(photo.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Patient Mode View
        <div className="space-y-6">
          {/* Status and Instructions */}
          <div className="mb-8 space-y-4">
            <div className={`p-4 rounded-lg border-2 ${speechSupported ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
              <div className="flex items-center space-x-2">
                {speechSupported ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">🎤 Speech Recognition Available</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-orange-800">⌨️ Text Input Only</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-2">📋 How to Play:</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>• Look at the photo and say what you see.</div>
                <div>• Click the microphone to start speaking.</div>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photos.map((photo, index) => (
              <PhotoEntry
                key={photo.id}
                imageUrl={photo.imageUrl}
                onMicClick={() => handleMicClick(index)}
                isRecording={recordingStates[index] || false}
                feedback={feedback[index]}
                speechSupported={speechSupported}
                networkError={networkError}
              />
            ))}
          </div>
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